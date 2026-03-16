import { layout, escHtml } from "../layout";
import { STATES, STATUSES, STATE_NAMES, ENFORCEMENT_STATUSES } from "../../constants";
import type { BillWithCategories, Category } from "../../types";
import type { SyncLogEntry } from "../../services/sync";
export function adminBillFormPage(options: {
  bill?: BillWithCategories;
  categories: Category[];
  error?: string;
  role?: string;
  syncLog?: SyncLogEntry[];
  syncMessage?: string;
}): string {
  const { bill, categories, error, role, syncLog, syncMessage } = options;
  const isEdit = !!bill;
  const hasLegiscan = !!(bill?.legiscan_bill_id);
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

  const activeEnforcement = bill?.enforcement_status;
  const enforcementOptions = ENFORCEMENT_STATUSES.map(s => {
    const selected = activeEnforcement === s ? " selected" : "";
    return `<option value="${escHtml(s)}"${selected}>${escHtml(s)}</option>`;
  }).join("");

  const reasonsByCategory = new Map(
    (bill?.categories ?? []).filter((c) => c.reason).map((c) => [c.id, c.reason!])
  );

  const categoryCheckboxes = categories.map(c => {
    const checked = billCategoryIds.has(c.id) ? " checked" : "";
    const reason = reasonsByCategory.get(c.id) ?? "";
    return `
      <div>
        <label class="checkbox-item">
          <input type="checkbox" name="category_ids" value="${c.id}"${checked}>
          ${escHtml(c.name)}
        </label>
        ${reason ? `<div style="margin-left:1.25rem;margin-top:0.15rem;margin-bottom:0.25rem;font-size:0.75rem;color:var(--muted,#64748b);font-style:italic">${escHtml(reason)}</div>` : ""}
        <input type="hidden" name="category_reason_${c.id}" value="${escHtml(reason)}">
      </div>
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

  // For linked bills in edit mode, LegiScan fields are read-only
  // For new bills or unlinked bills, everything is editable
  const legiscanSection = hasLegiscan ? buildLinkedLegiscanSection(bill) : buildUnlinkedLegiscanSection(bill, stateOptions, statusOptions);

  const content = `
    <div class="page-header">
      <h1>${isEdit ? "Edit Bill" : "Add Bill"}</h1>
    </div>

    ${error ? `<div class="error-message">${escHtml(error)}</div>` : ""}

    ${quickAddBox}

    <form method="POST" action="${formAction}">
      <!-- Hidden fields for LegiScan-managed data (preserved on save) -->
      <input type="hidden" id="f-legiscan-bill-id" name="legiscan_bill_id" value="${escHtml(String(bill?.legiscan_bill_id ?? ""))}">
      <input type="hidden" id="f-status-detail" name="status_detail" value="${escHtml(bill?.status_detail ?? "")}">
      <input type="hidden" id="f-last-action-date" name="last_action_date" value="${escHtml(bill?.last_action_date ?? "")}">
      <input type="hidden" id="f-last-action-description" name="last_action_description" value="${escHtml(bill?.last_action_description ?? "")}">
      ${hasLegiscan ? `
        <input type="hidden" name="state" value="${escHtml(bill.state)}">
        <input type="hidden" name="bill_number" value="${escHtml(bill.bill_number)}">
        <input type="hidden" name="title" value="${escHtml(bill.title ?? "")}">
        <input type="hidden" name="status_simple" value="${escHtml(bill.status_simple)}">
        <input type="hidden" name="date_introduced" value="${escHtml(bill.date_introduced ?? "")}">
        <input type="hidden" name="session_end_date" value="${escHtml(bill.session_end_date ?? "")}">
      ` : ""}

      ${legiscanSection}

      <div class="form-section">
        <h2>Our Analysis</h2>
        <div class="form-grid">
          ${hasLegiscan ? `
          <div class="form-group">
            <label for="f-status-override">Status Override</label>
            <select id="f-status-override" name="status_override">
              <option value="">— Use LegiScan status —</option>
              ${STATUSES.map(s => {
                const sel = bill?.status_override === s ? " selected" : "";
                return `<option value="${escHtml(s)}"${sel}>${escHtml(s)}</option>`;
              }).join("")}
            </select>
            <span class="form-hint">Override if LegiScan is wrong or slow to update</span>
          </div>
          <div class="form-group">
            <label for="f-title-override">Title Override</label>
            <input type="text" id="f-title-override" name="title_override" value="${escHtml(bill?.title_override ?? "")}" placeholder="Leave blank to use LegiScan title">
            <span class="form-hint">A more commonly known name for the bill</span>
          </div>
          ` : ""}
          <div class="form-group">
            <label for="f-enforcement">Enforcement Status</label>
            <select id="f-enforcement" name="enforcement_status">
              <option value="">— Not applicable —</option>
              ${enforcementOptions}
            </select>
            <span class="form-hint">Post-signing: is the law in force?</span>
          </div>
          <div class="form-group">
            <label for="f-legiscan-url">LegiScan URL</label>
            <input type="url" id="f-legiscan-url" name="legiscan_url" value="${escHtml(bill?.legiscan_url ?? "")}" placeholder="https://legiscan.com/STATE/bill/...">
            <span class="form-hint">${hasLegiscan ? "Change to re-link to a different bill" : "Paste to link this bill to LegiScan on save"}</span>
          </div>
        </div>
        <label class="checkbox-item" style="font-size:0.875rem;font-weight:600;color:#92400e;margin-top:1rem;">
          <input type="checkbox" name="urgent" value="1"${bill?.urgent ? " checked" : ""}>
          Action Alert — mark this bill as needing urgent attention
        </label>
      </div>

      <div class="form-section">
        <h2>Lawsuit Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="f-lawsuit-citation">Citation to Lawsuit</label>
            <input type="text" id="f-lawsuit-citation" name="lawsuit_citation" value="${escHtml(bill?.lawsuit_citation ?? "")}" placeholder="e.g. Netchoice v. Wilson, 3:26-cv-00543 (D.S.C.)">
          </div>
          <div class="form-group">
            <label for="f-recap-docket-url">RECAP Docket URL</label>
            <input type="url" id="f-recap-docket-url" name="recap_docket_url" value="${escHtml(bill?.recap_docket_url ?? "")}" placeholder="https://www.courtlistener.com/docket/...">
          </div>
        </div>
        <span class="form-hint">Appeals may have separate RECAP dockets.</span>
      </div>

      <div class="form-section">
        <h2>Categories</h2>
        <div class="checkbox-grid">
          ${categoryCheckboxes}
        </div>
      </div>

      <div class="form-section">
        <h2>Social Media Definition</h2>
        ${bill?.ai_social_media_definition ? `
        <div class="definition-box" style="margin-bottom:0.75rem">
          <strong>AI-extracted definition</strong>
          ${escHtml(bill.ai_social_media_definition)}
        </div>` : ""}
        <div class="form-group">
          <label for="f-definition">Definition used in this bill</label>
          <textarea id="f-definition" name="social_media_definition" rows="4">${escHtml(bill?.social_media_definition ?? "")}</textarea>
          <span class="form-hint">${bill?.ai_social_media_definition ? "You can use the AI-extracted definition above as a starting point." : "The specific definition of \"social media platform\" as written in the bill text."}</span>
        </div>
      </div>

      <div class="form-section">
        <h2>Notes</h2>
        ${bill?.ai_notes ? `
        <div class="definition-box" style="margin-bottom:0.75rem">
          <strong>AI-generated summary</strong>
          ${escHtml(bill.ai_notes)}
        </div>` : ""}
        <div class="form-group">
          <label for="f-notes">Editorial notes / analysis</label>
          <textarea id="f-notes" name="notes" rows="5">${escHtml(bill?.notes ?? "")}</textarea>
          <span class="form-hint">${bill?.ai_notes ? "You can use the AI summary above as a starting point." : ""}</span>
        </div>
      </div>

      <div class="form-actions" style="justify-content:space-between">
        <div style="display:flex;gap:0.75rem;align-items:center;">
          <button type="submit" class="btn btn-primary">Save Bill</button>
          <a href="/admin" class="btn btn-secondary">Cancel</a>
        </div>
        ${isEdit ? `<a href="/admin/bills/${bill.id}/delete" class="btn btn-danger btn-sm">Delete Bill</a>` : ""}
      </div>
    </form>
    ${isEdit && hasLegiscan ? buildSyncSection(bill, syncLog ?? [], syncMessage) : ""}
  `;

  return layout(pageTitle, content, { isAdmin: true, role });
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function buildLinkedLegiscanSection(bill: BillWithCategories): string {
  const stateName = STATE_NAMES[bill.state] ?? bill.state;
  return `
    <div class="form-section" style="background: var(--def-bg); border-color: var(--def-border);">
      <h2>LegiScan Data <span style="font-weight:400;text-transform:none;font-size:0.75rem;color:var(--muted2)">· Updated via sync — read only</span></h2>
      <div class="form-grid">
        <div class="form-group">
          <label>State</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(stateName)}</div>
        </div>
        <div class="form-group">
          <label>Bill Number</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(bill.bill_number)}</div>
        </div>
        <div class="form-group full-width">
          <label>Title</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(bill.title ?? "—")}</div>
        </div>
        <div class="form-group">
          <label>Legislative Status</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(bill.status_simple)}</div>
        </div>
        <div class="form-group">
          <label>Status Detail</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(bill.status_detail ?? "—")}</div>
        </div>
        <div class="form-group">
          <label>Date Introduced</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${formatDate(bill.date_introduced)}</div>
        </div>
        <div class="form-group">
          <label>Session End Date</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${formatDate(bill.session_end_date)}</div>
        </div>
        <div class="form-group">
          <label>Last Action</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${escHtml(bill.last_action_description ?? "—")}</div>
        </div>
        <div class="form-group">
          <label>Last Action Date</label>
          <div style="font-size:0.875rem;padding:0.45rem 0">${formatDate(bill.last_action_date)}</div>
        </div>
      </div>
    </div>
  `;
}

function buildUnlinkedLegiscanSection(bill: BillWithCategories | undefined, stateOptions: string, statusOptions: string): string {
  return `
    <div class="form-section">
      <h2>Bill Details <span style="font-weight:400;text-transform:none;font-size:0.75rem;color:var(--muted2)">· Paste a LegiScan URL below to auto-populate</span></h2>
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
          <label for="f-status">Legislative Status</label>
          <select id="f-status" name="status_simple" required>
            ${statusOptions}
          </select>
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
  `;
}

function formatSyncDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}

function buildSyncSection(bill: BillWithCategories, syncLog: SyncLogEntry[], syncMessage?: string): string {
  const syncMessages: Record<string, { cls: string; text: string }> = {
    updated: { cls: "info-box", text: "Bill updated from LegiScan." },
    hash_unchanged: { cls: "info-box", text: "No changes — LegiScan hash matches. Use Force Refresh to pull anyway." },
    no_legiscan_id: { cls: "error-message", text: "No LegiScan bill ID set." },
    no_data: { cls: "error-message", text: "LegiScan returned no data for this bill." },
    error: { cls: "error-message", text: "Sync failed — check the log below for details." },
    no_api_key: { cls: "error-message", text: "LegiScan API key not configured." },
    cache_cleared: { cls: "info-box", text: "Cached bill text cleared. Next analysis will re-fetch from LegiScan." },
    relinked: { cls: "info-box", text: "Bill re-linked to LegiScan. Click \"Analyze Bill Text\" to extract categories and definition from the new bill." },
    analyzed: { cls: "info-box", text: "AI analysis complete. Review the suggested notes and definition below — copy into the editorial fields if useful." },
  };

  const msg = syncMessage && syncMessages[syncMessage]
    ? `<div class="${syncMessages[syncMessage].cls}">${syncMessages[syncMessage].text}</div>`
    : "";

  const logRows = syncLog.map(entry => {
    const outcomeColors: Record<string, string> = {
      updated: "color:var(--quick-add-fg,#15803d)",
      hash_unchanged: "color:var(--muted2,#94a3b8)",
      error: "color:var(--error-fg,#dc2626)",
      no_data: "color:var(--error-fg,#dc2626)",
      no_legiscan_id: "color:var(--muted2,#94a3b8)",
    };
    const style = outcomeColors[entry.outcome] ?? "";

    let detail = "";
    if (entry.changes) {
      try {
        const changes = JSON.parse(entry.changes) as Record<string, { old: string | null; new: string | null }>;
        detail = Object.entries(changes).map(([field, { old: o, new: n }]) =>
          `<span style="color:var(--muted2,#94a3b8)">${escHtml(field)}:</span> ${escHtml(o ?? "(empty)")} → ${escHtml(n ?? "(empty)")}`
        ).join("<br>");
      } catch { /* ignore parse errors */ }
    }
    if (entry.error_message) {
      detail = `<span style="color:var(--error-fg,#dc2626)">${escHtml(entry.error_message)}</span>`;
    }
    if (entry.outcome === "hash_unchanged") {
      detail = `hash: ${escHtml(entry.old_hash ?? "none")}`;
    }

    return `
      <tr>
        <td style="white-space:nowrap">${formatSyncDate(entry.created_at)}</td>
        <td>${escHtml(entry.trigger_type)}</td>
        <td style="${style};font-weight:600">${escHtml(entry.outcome)}</td>
        <td style="font-size:0.8rem">${detail}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="form-section" style="margin-top:1.25rem">
      <h2>LegiScan Sync</h2>
      ${msg}
      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap;">
        <form method="POST" action="/admin/bills/${bill.id}/sync" style="display:inline">
          <button type="submit" class="btn btn-primary btn-sm">Refresh from LegiScan</button>
        </form>
        <form method="POST" action="/admin/bills/${bill.id}/sync" style="display:inline">
          <input type="hidden" name="force" value="1">
          <button type="submit" class="btn btn-secondary btn-sm">Force Refresh (ignore hash)</button>
        </form>
        <form method="POST" action="/admin/bills/${bill.id}/analyze" style="display:inline">
          <button type="submit" class="btn btn-primary btn-sm" style="background:#7c3aed">Analyze Bill Text</button>
        </form>
        <form method="POST" action="/admin/bills/${bill.id}/clear-text-cache" style="display:inline">
          <button type="submit" class="btn btn-secondary btn-sm">Clear Cached Text</button>
        </form>
        <span style="font-size:0.8rem;color:var(--muted2,#94a3b8)">
          Hash: ${escHtml(bill.change_hash ?? "none")} · LegiScan ID: ${bill.legiscan_bill_id}
        </span>
      </div>
      ${syncLog.length > 0 ? `
      <table class="admin-table" style="font-size:0.8rem">
        <thead>
          <tr>
            <th>Time</th>
            <th>Trigger</th>
            <th>Outcome</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${logRows}
        </tbody>
      </table>` : '<p style="color:var(--muted2,#94a3b8);font-size:0.85rem">No sync history yet.</p>'}
    </div>
  `;
}
