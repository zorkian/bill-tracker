import { layout, escHtml } from "../layout";
import { STATES, STATUSES, STATE_NAMES } from "../../constants";
import type { BillWithCategories, Category } from "../../types";

export function adminBillFormPage(options: {
  bill?: BillWithCategories;
  categories: Category[];
  error?: string;
}): string {
  const { bill, categories, error } = options;
  const isEdit = !!bill;
  const pageTitle = "Admin - " + (isEdit ? "Edit" : "Add") + " Bill";
  const formAction = isEdit ? `/admin/bills/${bill.id}` : "/admin/bills";
  const billCategoryIds = new Set((bill?.categories ?? []).map(c => c.id));

  const stateOptions = STATES.map(s => {
    const selected = bill?.state === s ? " selected" : "";
    return `<option value="${escHtml(s)}"${selected}>${escHtml(STATE_NAMES[s] ?? s)}</option>`;
  }).join("");

  const statusOptions = STATUSES.map(s => {
    const selected = bill?.status_simple === s ? " selected" : "";
    return `<option value="${escHtml(s)}"${selected}>${escHtml(s)}</option>`;
  }).join("");

  const categoryCheckboxes = categories.map(c => {
    const checked = billCategoryIds.has(c.id) ? " checked" : "";
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="category_ids" value="${c.id}"${checked}>
        ${escHtml(c.name)}
      </label>
    `;
  }).join("");

  // Quick Add box — only in add mode
  const quickAddBox = !isEdit ? `
    <div class="quick-add-box">
      <h2>Legiscan Quick Add</h2>
      <div class="quick-add-row">
        <div class="form-group">
          <label for="qa-state">State</label>
          <select id="qa-state">
            <option value="">Select state…</option>
            ${STATES.map(s => `<option value="${escHtml(s)}">${escHtml(STATE_NAMES[s] ?? s)}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="qa-bill-number">Bill Number</label>
          <input type="text" id="qa-bill-number" placeholder="e.g. HB 2991">
        </div>
        <button type="button" class="btn btn-primary" id="qa-lookup-btn" onclick="legiscanLookup()">Look Up</button>
      </div>
      <div class="quick-add-status" id="qa-status"></div>
    </div>
    <script>
    async function legiscanLookup() {
      const state = document.getElementById('qa-state').value;
      const billNumber = document.getElementById('qa-bill-number').value.trim();
      const statusEl = document.getElementById('qa-status');
      if (!state || !billNumber) {
        statusEl.textContent = 'Please select a state and enter a bill number.';
        statusEl.style.color = '#dc2626';
        return;
      }
      statusEl.textContent = 'Looking up…';
      statusEl.style.color = '#64748b';
      try {
        const params = new URLSearchParams({ state, bill_number: billNumber });
        const res = await fetch('/admin/legiscan-lookup?' + params.toString());
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          statusEl.textContent = 'Error: ' + (err.error || res.statusText);
          statusEl.style.color = '#dc2626';
          return;
        }
        const data = await res.json();
        // Populate form fields
        if (data.title) document.getElementById('f-title').value = data.title;
        if (data.bill_number) document.getElementById('f-bill-number').value = data.bill_number;
        if (data.state) document.getElementById('f-state').value = data.state;
        if (data.status_simple) document.getElementById('f-status').value = data.status_simple;
        if (data.status_detail) document.getElementById('f-status-detail').value = data.status_detail;
        if (data.date_introduced) document.getElementById('f-date-introduced').value = data.date_introduced;
        if (data.last_action_date) document.getElementById('f-last-action-date').value = data.last_action_date;
        if (data.last_action_description) document.getElementById('f-last-action-description').value = data.last_action_description;
        if (data.session_end_date) document.getElementById('f-session-end-date').value = data.session_end_date;
        if (data.legiscan_url) document.getElementById('f-legiscan-url').value = data.legiscan_url;
        if (data.legiscan_bill_id) document.getElementById('f-legiscan-bill-id').value = data.legiscan_bill_id;
        statusEl.textContent = 'Fields populated from Legiscan. Review and save.';
        statusEl.style.color = '#15803d';
      } catch (e) {
        statusEl.textContent = 'Network error. Please try again.';
        statusEl.style.color = '#dc2626';
      }
    }
    </script>
  ` : "";

  const content = `
    <div class="page-header">
      <h1>${isEdit ? "Edit Bill" : "Add Bill"}</h1>
    </div>

    ${error ? `<div class="error-message">${escHtml(error)}</div>` : ""}

    ${quickAddBox}

    <form method="POST" action="${formAction}">
      <!-- Hidden fields -->
      <input type="hidden" id="f-legiscan-bill-id" name="legiscan_bill_id" value="${escHtml(String(bill?.legiscan_bill_id ?? ""))}">
      <input type="hidden" id="f-status-detail" name="status_detail" value="${escHtml(bill?.status_detail ?? "")}">
      <input type="hidden" id="f-last-action-date" name="last_action_date" value="${escHtml(bill?.last_action_date ?? "")}">
      <input type="hidden" id="f-last-action-description" name="last_action_description" value="${escHtml(bill?.last_action_description ?? "")}">

      <div class="form-section">
        <h2>Bill Details</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="f-state">State</label>
            <select id="f-state" name="state" required>
              <option value="">Select state…</option>
              ${stateOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="f-bill-number">Bill Number</label>
            <input type="text" id="f-bill-number" name="bill_number" value="${escHtml(bill?.bill_number ?? "")}" placeholder="e.g. HB 2991" required>
          </div>
          <div class="form-group full-width">
            <label for="f-title">Title</label>
            <input type="text" id="f-title" name="title" value="${escHtml(bill?.title ?? "")}">
          </div>
          <div class="form-group">
            <label for="f-status">Status</label>
            <select id="f-status" name="status_simple" required>
              ${statusOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="f-legiscan-url">Legiscan URL</label>
            <input type="url" id="f-legiscan-url" name="legiscan_url" value="${escHtml(bill?.legiscan_url ?? "")}">
          </div>
          <div class="form-group">
            <label for="f-date-introduced">Date Introduced</label>
            <input type="date" id="f-date-introduced" name="date_introduced" value="${escHtml(bill?.date_introduced ?? "")}">
          </div>
          <div class="form-group">
            <label for="f-session-end-date">Session End Date</label>
            <input type="date" id="f-session-end-date" name="session_end_date" value="${escHtml(bill?.session_end_date ?? "")}">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Categories</h2>
        <div class="checkbox-grid">
          ${categoryCheckboxes}
        </div>
      </div>

      <div class="form-section">
        <h2>Social Media Definition</h2>
        <div class="form-group">
          <label for="f-definition">Definition used in this bill</label>
          <textarea id="f-definition" name="social_media_definition" rows="4">${escHtml(bill?.social_media_definition ?? "")}</textarea>
          <span class="form-hint">The specific definition of "social media platform" as written in the bill text.</span>
        </div>
      </div>

      <div class="form-section">
        <h2>Notes</h2>
        <div class="form-group">
          <label for="f-notes">Editorial notes / analysis</label>
          <textarea id="f-notes" name="notes" rows="5">${escHtml(bill?.notes ?? "")}</textarea>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save Bill</button>
        <a href="/admin" class="btn btn-secondary">Cancel</a>
      </div>
    </form>
  `;

  return layout(pageTitle, content, true);
}
