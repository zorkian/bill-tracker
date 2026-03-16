import { getMasterListRaw } from "../services/legiscan";
import { syncBillFromLegiscan } from "../services/sync";
import type { Bill } from "../types";

const TERMINAL_STATUSES = ["Signed Into Law", "Vetoed", "Failed"];

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
        if (!remoteHash) continue;
        await syncBillFromLegiscan(db, apiKey, bill, "cron", { remoteHash });
      }
    } catch (e) {
      console.error(`Failed to get master list for session ${sessionId}:`, e);
      for (const bill of sessionBills) {
        await syncBillFromLegiscan(db, apiKey, bill, "cron");
      }
    }
  }

  // For bills without a session_id, fetch individually
  for (const bill of noSession) {
    await syncBillFromLegiscan(db, apiKey, bill, "cron");
  }
}
