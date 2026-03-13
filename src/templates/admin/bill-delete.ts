import { layout, escHtml } from "../layout";
import { STATE_NAMES } from "../../constants";
import type { BillWithCategories } from "../../types";

export function adminBillDeletePage(bill: BillWithCategories, role?: string): string {
  const stateName = STATE_NAMES[bill.state] ?? bill.state;

  const content = `
    <div class="page-header">
      <h1>Delete Bill</h1>
    </div>

    <div class="warning-box">
      <h2>Are you sure you want to delete this bill?</h2>
      <p>
        <strong>${escHtml(stateName)} — ${escHtml(bill.bill_number)}</strong>
        ${bill.title ? `<br><span style="font-size:0.875rem;color:#7c2d12">${escHtml(bill.title)}</span>` : ""}
      </p>
      <p style="margin-top:0.75rem;font-size:0.875rem">This action cannot be undone.</p>
    </div>

    <div class="form-actions">
      <form method="POST" action="/admin/bills/${bill.id}/delete">
        <button type="submit" class="btn btn-danger">Confirm Delete</button>
      </form>
      <a href="/admin/bills/${bill.id}/edit" class="btn btn-secondary">Cancel</a>
    </div>
  `;

  return layout("Admin - Delete Bill", content, { isAdmin: true, role });
}
