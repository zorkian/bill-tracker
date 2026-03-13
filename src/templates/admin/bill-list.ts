import { layout, escHtml, statusClass } from "../layout";
import { STATE_NAMES } from "../../constants";
import type { Bill } from "../../types";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function adminBillListPage(bills: Bill[]): string {
  const rows = bills.map(bill => {
    const stateName = STATE_NAMES[bill.state] ?? bill.state;
    const badgeClass = statusClass(bill.status_simple);
    return `
      <tr>
        <td>${escHtml(stateName)}</td>
        <td><a href="/admin/bills/${bill.id}/edit">${escHtml(bill.bill_number)}</a></td>
        <td>${escHtml(bill.title ?? "")}</td>
        <td><span class="status-badge ${badgeClass}">${escHtml(bill.status_simple)}</span></td>
        <td>${formatDate(bill.updated_at)}</td>
        <td>
          <a href="/admin/bills/${bill.id}/edit" class="btn btn-secondary btn-sm">Edit</a>
          <a href="/admin/bills/${bill.id}/delete" class="btn btn-danger btn-sm" style="margin-left:0.3rem">Delete</a>
        </td>
      </tr>
    `;
  }).join("");

  const emptyRow = bills.length === 0
    ? `<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:2rem">No bills yet. <a href="/admin/bills/new">Add one</a>.</td></tr>`
    : "";

  const content = `
    <div class="page-header">
      <h1>Bills</h1>
      <a href="/admin/bills/new" class="btn btn-primary">+ Add Bill</a>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>State</th>
          <th>Bill Number</th>
          <th>Title</th>
          <th>Status</th>
          <th>Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        ${emptyRow}
      </tbody>
    </table>
  `;

  return layout("Admin - Bills", content, { isAdmin: true });
}
