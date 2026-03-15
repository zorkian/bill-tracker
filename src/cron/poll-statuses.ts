import { getBillDetails, getMasterListRaw } from "../services/legiscan";
import type { Bill } from "../types";

const TERMINAL_STATUSES = [
  "Signed Into Law", "Vetoed", "Failed",
  "Lawsuit Filed, Temporarily Enjoined", "Lawsuit Filed, Law in Effect",
  "Law Ruled Unconstitutional",
];

export async function pollStatuses(db: D1Database, apiKey: string): Promise<void> {
  const bills = await db
    .prepare(
      `SELECT * FROM bills
       WHERE legiscan_bill_id IS NOT NULL
       AND status_simple NOT IN (${TERMINAL_STATUSES.map(() => "?").join(",")})`,
    )
    .bind(...TERMINAL_STATUSES)
    .all<Bill>();

  if (bills.results.length === 0) return;

  // Group bills by session to use getMasterListRaw work loop
  const bySession = new Map<number, Bill[]>();
  const noSession: Bill[] = [];

  for (const bill of bills.results) {
    if (bill.legiscan_session_id) {
      const group = bySession.get(bill.legiscan_session_id) ?? [];
      group.push(bill);
      bySession.set(bill.legiscan_session_id, group);
    } else {
      noSession.push(bill);
    }
  }

  // For bills with a session_id, check getMasterListRaw first
  for (const [sessionId, sessionBills] of bySession) {
    try {
      const masterList = await getMasterListRaw(apiKey, sessionId);
      const hashByBillId = new Map(masterList.map((e) => [e.bill_id, e.change_hash]));

      for (const bill of sessionBills) {
        const remoteHash = hashByBillId.get(bill.legiscan_bill_id!);
        if (!remoteHash) continue; // bill not in this session's master list
        if (remoteHash === bill.change_hash) continue; // unchanged, skip

        await fetchAndUpdateBill(db, apiKey, bill, remoteHash);
      }
    } catch (e) {
      console.error(`Failed to get master list for session ${sessionId}:`, e);
      // Fall back to individual fetches for this session's bills
      for (const bill of sessionBills) {
        await fetchAndUpdateBill(db, apiKey, bill);
      }
    }
  }

  // For bills without a session_id, fetch individually (and store session_id for next time)
  for (const bill of noSession) {
    await fetchAndUpdateBill(db, apiKey, bill);
  }
}

async function fetchAndUpdateBill(
  db: D1Database,
  apiKey: string,
  bill: Bill,
  knownHash?: string
): Promise<void> {
  try {
    const result = await getBillDetails(apiKey, bill.legiscan_bill_id!);
    if (!result) {
      console.error(`LegiScan returned no data for bill ${bill.id} (legiscan_bill_id=${bill.legiscan_bill_id})`);
      return;
    }

    await db
      .prepare(
        `UPDATE bills SET
          status_simple = ?,
          status_detail = ?,
          last_action_date = ?,
          last_action_description = ?,
          change_hash = ?,
          legiscan_session_id = COALESCE(?, legiscan_session_id),
          updated_at = ?
         WHERE id = ?`
      )
      .bind(
        result.status_simple,
        result.status_detail,
        result.last_action_date,
        result.last_action_description,
        knownHash ?? result.change_hash,
        result.session_id,
        new Date().toISOString(),
        bill.id
      )
      .run();
  } catch (e) {
    console.error(`Failed to poll status for bill ${bill.id}:`, e);
  }
}
