import { getBillDetails } from "../services/legiscan";
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

  for (const bill of bills.results) {
    try {
      const result = await getBillDetails(apiKey, bill.legiscan_bill_id!);
      if (!result) {
        console.error(`Legiscan returned no data for bill ${bill.id} (legiscan_bill_id=${bill.legiscan_bill_id})`);
        continue;
      }

      await db
        .prepare(
          `UPDATE bills SET
            status_simple = ?,
            status_detail = ?,
            last_action_date = ?,
            last_action_description = ?,
            updated_at = ?
           WHERE id = ?`
        )
        .bind(
          result.status_simple,
          result.status_detail,
          result.last_action_date,
          result.last_action_description,
          new Date().toISOString(),
          bill.id
        )
        .run();
    } catch (e) {
      console.error(`Failed to poll status for bill ${bill.id}:`, e);
    }
  }
}
