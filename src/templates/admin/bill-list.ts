import { layout, escHtml, statusClass } from "../layout";
import { STATE_NAMES, STATUSES, ENFORCEMENT_STATUSES } from "../../constants";
import { displayStatus, displayTitle, type Bill } from "../../types";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function adminBillListPage(bills: Bill[], role?: string): string {
  const rows = bills.map(bill => {
    const stateName = STATE_NAMES[bill.state] ?? bill.state;
    const effectiveStatus = displayStatus(bill);
    const badgeClass = statusClass(effectiveStatus);
    return `
      <tr data-status="${escHtml(effectiveStatus)}" data-enforcement="${escHtml(bill.enforcement_status ?? "")}">
        <td>${escHtml(stateName)}</td>
        <td><a href="/admin/bills/${bill.id}/edit">${escHtml(bill.bill_number)}</a></td>
        <td>${escHtml(displayTitle(bill) ?? "")}</td>
        <td><span class="status-badge ${badgeClass}">${escHtml(effectiveStatus)}</span>${bill.enforcement_status ? ` <span class="status-badge enforcement-${bill.enforcement_status.toLowerCase().replace(/\s+/g, "-")}">${escHtml(bill.enforcement_status)}</span>` : ""}</td>
        <td>${formatDate(bill.updated_at)}</td>
        <td>
          <a href="/admin/bills/${bill.id}/edit" class="btn btn-secondary btn-sm">Edit</a>
        </td>
      </tr>
    `;
  }).join("");

  const emptyRow = bills.length === 0
    ? `<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:2rem">No bills yet. <a href="/admin/bills/new">Add one</a>.</td></tr>`
    : "";

  const statusOptions = STATUSES.map(s => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join("");
  const enforcementOptions = ENFORCEMENT_STATUSES.map(s => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join("");

  const content = `
    <div class="page-header">
      <h1>Bills</h1>
      <a href="/admin/bills/new" class="btn btn-primary">+ Add Bill</a>
    </div>
    <div style="display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap;align-items:flex-end;">
      <div class="filter-group" style="min-width:150px">
        <label for="admin-filter-status">Legislative Status</label>
        <select id="admin-filter-status" onchange="adminFilter()">
          <option value="">All</option>
          ${statusOptions}
        </select>
      </div>
      <div class="filter-group" style="min-width:150px">
        <label for="admin-filter-enforcement">Enforcement</label>
        <select id="admin-filter-enforcement" onchange="adminFilter()">
          <option value="">All</option>
          ${enforcementOptions}
        </select>
      </div>
      <button type="button" class="filter-reset" onclick="document.getElementById('admin-filter-status').value='';document.getElementById('admin-filter-enforcement').value='';adminFilter()">Reset</button>
    </div>
    <script>
    function adminFilter(){var s=document.getElementById('admin-filter-status').value;var e=document.getElementById('admin-filter-enforcement').value;document.querySelectorAll('#admin-bills-table tbody tr[data-status]').forEach(function(r){var show=(!s||r.dataset.status===s)&&(!e||r.dataset.enforcement===e);r.style.display=show?'':'none'})}
    </script>
    <table class="admin-table" id="admin-bills-table">
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

  return layout("Admin - Bills", content, { isAdmin: true, role });
}
