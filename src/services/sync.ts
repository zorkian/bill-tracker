import { getBillDetails } from "./legiscan";
import type { Bill } from "../types";

export interface SyncLogEntry {
  id: number;
  bill_id: number;
  trigger_type: string;
  outcome: string;
  old_hash: string | null;
  new_hash: string | null;
  changes: string | null;
  error_message: string | null;
  created_at: string;
}

export type SyncOutcome =
  | "updated"
  | "hash_unchanged"
  | "no_legiscan_id"
  | "no_data"
  | "error";

interface SyncResult {
  outcome: SyncOutcome;
  changes?: Record<string, { old: string | null; new: string | null }>;
  error?: string;
}

export async function syncBillFromLegiscan(
  db: D1Database,
  apiKey: string,
  bill: Bill,
  trigger: string,
  options?: { force?: boolean; remoteHash?: string }
): Promise<SyncResult> {
  if (!bill.legiscan_bill_id) {
    await logSync(db, bill.id, trigger, "no_legiscan_id", bill.change_hash, null, null, null);
    return { outcome: "no_legiscan_id" };
  }

  // If we have a remote hash (from getMasterListRaw) and it matches, skip
  if (!options?.force && options?.remoteHash && options.remoteHash === bill.change_hash) {
    await logSync(db, bill.id, trigger, "hash_unchanged", bill.change_hash, options.remoteHash, null, null);
    return { outcome: "hash_unchanged" };
  }

  try {
    const result = await getBillDetails(apiKey, bill.legiscan_bill_id);
    if (!result) {
      await logSync(db, bill.id, trigger, "no_data", bill.change_hash, null, null, "LegiScan returned no data");
      return { outcome: "no_data", error: "LegiScan returned no data" };
    }

    // If not forced and hash from getBill matches stored hash, skip
    if (!options?.force && result.change_hash && result.change_hash === bill.change_hash) {
      await logSync(db, bill.id, trigger, "hash_unchanged", bill.change_hash, result.change_hash, null, null);
      return { outcome: "hash_unchanged" };
    }

    // Compute changes
    const changes: Record<string, { old: string | null; new: string | null }> = {};
    const fields = [
      ["status_simple", bill.status_simple, result.status_simple],
      ["status_detail", bill.status_detail, result.status_detail],
      ["last_action_date", bill.last_action_date, result.last_action_date],
      ["last_action_description", bill.last_action_description, result.last_action_description],
      ["title", bill.title, result.title],
      ["date_introduced", bill.date_introduced, result.date_introduced],
      ["session_end_date", bill.session_end_date, result.session_end_date],
    ] as const;

    for (const [field, oldVal, newVal] of fields) {
      if ((oldVal ?? null) !== (newVal ?? null)) {
        changes[field] = { old: oldVal ?? null, new: newVal ?? null };
      }
    }

    const newHash = options?.remoteHash ?? result.change_hash;

    await db
      .prepare(
        `UPDATE bills SET
          status_simple = ?,
          status_detail = ?,
          last_action_date = ?,
          last_action_description = ?,
          title = COALESCE(?, title),
          date_introduced = COALESCE(?, date_introduced),
          session_end_date = COALESCE(?, session_end_date),
          change_hash = ?,
          legiscan_session_id = COALESCE(?, legiscan_session_id),
          updated_at = ?
         WHERE id = ?`
      )
      .bind(
        result.status_simple ?? null,
        result.status_detail ?? null,
        result.last_action_date ?? null,
        result.last_action_description ?? null,
        result.title ?? null,
        result.date_introduced ?? null,
        result.session_end_date ?? null,
        newHash ?? null,
        result.session_id ?? null,
        new Date().toISOString(),
        bill.id
      )
      .run();

    const changesJson = Object.keys(changes).length > 0 ? JSON.stringify(changes) : null;
    await logSync(db, bill.id, trigger, "updated", bill.change_hash, newHash, changesJson, null);
    return { outcome: "updated", changes };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logSync(db, bill.id, trigger, "error", bill.change_hash, null, null, msg);
    return { outcome: "error", error: msg };
  }
}

export async function logSync(
  db: D1Database,
  billId: number,
  trigger: string,
  outcome: string,
  oldHash: string | null,
  newHash: string | null,
  changes: string | null,
  errorMessage: string | null
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sync_log (bill_id, trigger_type, outcome, old_hash, new_hash, changes, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(billId, trigger, outcome, oldHash ?? null, newHash ?? null, changes ?? null, errorMessage ?? null)
    .run();
}

export async function getSyncLogForBill(db: D1Database, billId: number, limit = 20): Promise<SyncLogEntry[]> {
  const result = await db
    .prepare("SELECT * FROM sync_log WHERE bill_id = ? ORDER BY created_at DESC LIMIT ?")
    .bind(billId, limit)
    .all<SyncLogEntry>();
  return result.results;
}
