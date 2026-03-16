import { layout, escHtml, statusClass } from "../layout";
import { STATES, STATUSES, STATE_NAMES, STATUS_COLORS, ENFORCEMENT_COLORS, ENFORCEMENT_STATUSES } from "../../constants";
import { displayStatus, displayTitle, type BillWithCategories, type Category, type EnforcementStatus } from "../../types";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  // ISO date strings may be date-only (YYYY-MM-DD) or full timestamps
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function getBorderClass(status: string): string {
  return "border-" + status.toLowerCase().replace(/\s+/g, "-");
}

function getBorderColor(status: string): string {
  const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS];
  return colors ? colors.border : "#94a3b8";
}

export function publicIndexPage(bills: BillWithCategories[], categories: Category[]): string {
  const totalCount = bills.length;
  const signedCount = bills.filter(b => displayStatus(b) === "Signed Into Law").length;
  const inProgressCount = bills.filter(b => {
    const s = displayStatus(b);
    return s === "Introduced" || s === "Passed One Chamber" || s === "Passed Both Chambers";
  }).length;
  const failedCount = bills.filter(b => {
    const s = displayStatus(b);
    return s === "Failed" || s === "Vetoed";
  }).length;

  const stateOptions = STATES.map(s =>
    `<option value="${escHtml(s)}">${escHtml(STATE_NAMES[s] ?? s)}</option>`
  ).join("");

  const statusOptions = STATUSES.map(s =>
    `<option value="${escHtml(s)}">${escHtml(s)}</option>`
  ).join("");

  const categoryOptions = categories.map(c =>
    `<option value="${c.id}">${escHtml(c.name)}</option>`
  ).join("");

  const filterBar = `
    <div class="filter-bar" id="filter-bar">
      <div class="filter-group">
        <label for="filter-state">State</label>
        <select id="filter-state" name="state">
          <option value="">All States</option>
          ${stateOptions}
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-status">Status</label>
        <select id="filter-status" name="status">
          <option value="">All Statuses</option>
          ${statusOptions}
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-category">Category</label>
        <select id="filter-category" name="category">
          <option value="">All Categories</option>
          ${categoryOptions}
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-search">Search</label>
        <input type="search" id="filter-search" name="search" placeholder="Bill number, title, notes…">
      </div>
      <button type="button" class="filter-reset" id="filter-reset">Reset</button>
    </div>
  `;

  const statsBar = `
    <div class="stats-bar" id="stats-bar">
      <div class="stat-item"><strong id="stat-total">${totalCount}</strong> <span class="stat-label">Total</span></div>
      <div class="stat-item"><strong id="stat-signed">${signedCount}</strong> <span class="stat-label">Signed Into Law</span></div>
      <div class="stat-item"><strong id="stat-progress">${inProgressCount}</strong> <span class="stat-label">In Progress</span></div>
      <div class="stat-item"><strong id="stat-failed">${failedCount}</strong> <span class="stat-label">Failed / Vetoed</span></div>
    </div>
  `;

  const billCards = bills.map(bill => {
    const stateName = STATE_NAMES[bill.state] ?? bill.state;
    const effectiveStatus = displayStatus(bill);
    const effectiveTitle = displayTitle(bill);
    const cardTitle = `${escHtml(stateName)} — ${escHtml(bill.bill_number)}`;
    const badgeClass = statusClass(effectiveStatus);
    const borderColor = getBorderColor(effectiveStatus);
    const categoryIdList = bill.categories.map(c => c.id).join(",");
    const searchText = [
      bill.state,
      stateName,
      bill.bill_number,
      effectiveTitle ?? "",
      bill.notes ?? "",
      bill.social_media_definition ?? "",
    ].join(" ").toLowerCase();

    const categoryPills = bill.categories.length > 0
      ? `<div class="category-pills">${bill.categories.map(c => `<span class="category-pill">${escHtml(c.name)}</span>`).join("")}</div>`
      : "";

    const defText = bill.social_media_definition ?? bill.ai_social_media_definition;
    const definitionBox = defText
      ? `<div class="definition-box"><strong>Social Media Definition</strong>${escHtml(defText)}</div>`
      : "";

    const notesText = bill.notes ?? bill.ai_notes;
    const notesCallout = notesText
      ? `<div class="notes-callout"><strong>Notes</strong>${escHtml(notesText)}</div>`
      : "";

    const lastActionParts = [];
    if (bill.last_action_description) lastActionParts.push(escHtml(bill.last_action_description));
    if (bill.last_action_date) lastActionParts.push(formatDate(bill.last_action_date));
    const lastActionText = lastActionParts.join(" — ");

    const isActive = effectiveStatus === "Introduced" ||
      effectiveStatus === "Passed One Chamber" ||
      effectiveStatus === "Passed Both Chambers";

    const sessionEndText = isActive && bill.session_end_date
      ? ` · Session ends ${formatDate(bill.session_end_date)}`
      : "";

    const legiscanLink = bill.legiscan_url
      ? `<a href="${escHtml(bill.legiscan_url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">View on Legiscan →</a>`
      : "";

    const urgentStyle = bill.urgent
      ? "background: var(--urgent-bg); border-top-color: var(--urgent-border); border-right-color: var(--urgent-border); border-bottom-color: var(--urgent-border);"
      : "";
    const urgentPrefix = bill.urgent
      ? `<span class="action-alert-badge">Action Alert</span> `
      : "";

    return `
      <div class="bill-card"
        style="border-left-color: ${borderColor}; cursor: pointer; ${urgentStyle}"
        data-state="${escHtml(bill.state)}"
        data-status="${escHtml(effectiveStatus)}"
        data-categories="${categoryIdList}"
        data-search="${escHtml(searchText)}"
        onclick="window.location='/bill/${bill.id}'"
        ${bill.urgent ? 'aria-label="Action Alert: ' + escHtml(cardTitle) + '"' : ""}>
        <div class="bill-card-header">
          <div class="bill-card-title">${urgentPrefix}${cardTitle}</div>
          <div>
            <span class="status-badge ${badgeClass}">${escHtml(effectiveStatus)}</span>
            ${bill.enforcement_status ? `<span class="status-badge enforcement-${bill.enforcement_status.toLowerCase().replace(/\s+/g, "-")}" style="margin-left:0.25rem">${escHtml(bill.enforcement_status)}</span>` : ""}
          </div>
        </div>
        ${effectiveTitle ? `<div class="bill-card-name">${escHtml(effectiveTitle)}</div>` : ""}
        ${lastActionText || sessionEndText ? `<div class="bill-card-subtitle">${lastActionText}${sessionEndText}</div>` : ""}
        ${categoryPills}
        ${bill.lawsuit_citation ? `<div class="bill-card-subtitle" style="font-style:italic">${escHtml(bill.lawsuit_citation)}</div>` : ""}
        ${definitionBox}
        ${notesCallout}
        <div class="bill-card-footer">
          <span>Last updated ${formatDate(bill.updated_at)}</span>
          ${legiscanLink}
        </div>
      </div>
    `;
  }).join("");

  const content = `
    <div id="us-map"></div>
    ${filterBar}
    ${statsBar}
    <div class="bills-grid" id="bills-grid">
      ${bills.length === 0 ? '<p style="color:#94a3b8;text-align:center;padding:3rem 0">No bills tracked yet.</p>' : billCards}
    </div>
    <div class="no-bills" id="no-bills">No bills match your filters.</div>
  `;

  return layout("Social Media Bill Tracker", content);
}
