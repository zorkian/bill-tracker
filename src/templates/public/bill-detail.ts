import { layout, escHtml, statusClass } from "../layout";
import { STATE_NAMES } from "../../constants";
import { displayStatus, displayTitle, type BillWithCategories } from "../../types";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function detailRow(label: string, value: string | null | undefined, raw = false): string {
  if (!value) return "";
  return `
    <div class="detail-row">
      <div class="detail-label">${label}</div>
      <div class="detail-value">${raw ? value : escHtml(value)}</div>
    </div>
  `;
}

export function billDetailPage(bill: BillWithCategories, options?: { isAdmin?: boolean }): string {
  const stateName = STATE_NAMES[bill.state] ?? bill.state;
  const effectiveStatus = displayStatus(bill);
  const effectiveTitle = displayTitle(bill);
  const badgeClass = statusClass(effectiveStatus);

  const hasAnyReasons = bill.categories.some(c => c.reason);
  const categoryPills = bill.categories.length > 0
    ? `<div class="category-pills">${bill.categories.map((c, i) => {
        if (c.reason) {
          return `<span class="category-pill category-pill-expandable" id="cat-pill-${i}" onclick="toggleCatReason(${i})" style="cursor:pointer">${escHtml(c.name)} <span class="cat-arrow" id="cat-arrow-${i}" style="font-size:0.6rem;opacity:0.7">▼</span></span>`;
        }
        return `<span class="category-pill">${escHtml(c.name)}</span>`;
      }).join("")}</div>
      <div id="cat-reason-container">
      ${bill.categories.map((c, i) => c.reason
        ? `<div id="cat-reason-${i}" class="cat-reason-box" style="display:none;margin-top:0.35rem;margin-bottom:0.35rem;padding:0.5rem 0.75rem;font-size:0.8rem;color:var(--muted3,#475569);background:var(--def-bg,#f8fafc);border:1px solid var(--def-border,#e2e8f0);border-radius:6px"><strong style="color:var(--muted,#64748b);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem">${escHtml(c.name)}</strong>${escHtml(c.reason)}</div>`
        : ""
      ).join("")}
      </div>
      ${hasAnyReasons ? '<div style="font-size:0.7rem;color:var(--muted2,#94a3b8);margin-top:0.25rem">Click a category to see why it applies</div>' : ""}
      <script>
      function toggleCatReason(i){var boxes=document.querySelectorAll('.cat-reason-box');var pills=document.querySelectorAll('.category-pill-expandable');var target=document.getElementById('cat-reason-'+i);var wasOpen=target.style.display!=='none';boxes.forEach(function(b){b.style.display='none'});pills.forEach(function(p){p.classList.remove('category-pill-active');var a=p.querySelector('.cat-arrow');if(a)a.textContent='\\u25BC'});if(!wasOpen){target.style.display='block';var pill=document.getElementById('cat-pill-'+i);pill.classList.add('category-pill-active');var arrow=document.getElementById('cat-arrow-'+i);if(arrow)arrow.textContent='\\u25B2'}}
      </script>`
    : "";

  const defText = bill.social_media_definition ?? bill.ai_social_media_definition;
  const definitionBox = defText
    ? `<div class="definition-box"><strong>Social Media Definition</strong>${escHtml(defText)}</div>`
    : "";

  const notesText = bill.notes ?? bill.ai_notes;
  const notesCallout = notesText
    ? `<div class="notes-callout"><strong>Notes</strong>${escHtml(notesText)}</div>`
    : "";

  const legiscanLink = bill.legiscan_url
    ? `<a href="${escHtml(bill.legiscan_url)}" target="_blank" rel="noopener">View on Legiscan →</a>`
    : "";

  const content = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
      <a href="/" class="back-link" style="margin-bottom:0">← All Bills</a>
      ${options?.isAdmin ? `<a href="/admin/bills/${bill.id}/edit" class="btn btn-sm btn-secondary">Edit Bill</a>` : ""}
    </div>
    ${bill.urgent ? `<div role="alert" style="background:#dc2626;color:#fff;font-weight:700;text-align:center;padding:0.6rem 1rem;border-radius:8px 8px 0 0;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;">Action Alert</div>` : ""}
    <div class="detail-card"${bill.urgent ? ' style="border-radius:0 0 8px 8px;border-top:none;background:var(--urgent-bg);"' : ""}>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap;">
        <div>
          <h1 style="font-size:1.25rem;font-weight:700;color:var(--fg);margin-bottom:0.25rem">
            ${escHtml(stateName)} — ${escHtml(bill.bill_number)}
          </h1>
          ${effectiveTitle ? `<p style="color:var(--muted3);font-size:0.9rem">${escHtml(effectiveTitle)}</p>` : ""}
        </div>
        <div>
          <span class="status-badge ${badgeClass}" style="font-size:0.8rem;padding:0.3rem 0.7rem">${escHtml(effectiveStatus)}</span>
          ${bill.enforcement_status ? `<span class="status-badge enforcement-${bill.enforcement_status.toLowerCase().replace(/\s+/g, "-")}" style="font-size:0.8rem;padding:0.3rem 0.7rem;margin-left:0.35rem">${escHtml(bill.enforcement_status)}</span>` : ""}
        </div>
      </div>

      ${bill.categories.length > 0 ? `<div style="margin-bottom:1rem">${categoryPills}</div>` : ""}

      ${definitionBox}
      ${notesCallout}

      <div style="margin-top:1rem;">
        ${detailRow("State", stateName)}
        ${detailRow("Bill Number", bill.bill_number)}
        ${detailRow("Legislative Status", effectiveStatus)}
        ${bill.enforcement_status ? detailRow("Enforcement", bill.enforcement_status) : ""}
        ${bill.status_detail ? detailRow("Status Detail", bill.status_detail) : ""}
        ${bill.date_introduced ? detailRow("Date Introduced", formatDate(bill.date_introduced)) : ""}
        ${bill.last_action_date ? detailRow("Last Action Date", formatDate(bill.last_action_date)) : ""}
        ${bill.last_action_description ? detailRow("Last Action", bill.last_action_description) : ""}
        ${bill.session_end_date ? detailRow("Session End Date", formatDate(bill.session_end_date)) : ""}
        ${bill.lawsuit_citation ? detailRow("Lawsuit", bill.lawsuit_citation) : ""}
        ${bill.recap_docket_url ? `
        <div class="detail-row">
          <div class="detail-label">Court Docket</div>
          <div class="detail-value"><a href="${escHtml(bill.recap_docket_url)}" target="_blank" rel="noopener">View on RECAP / CourtListener →</a></div>
        </div>` : ""}
        ${detailRow("Last Updated", formatDate(bill.updated_at))}
        ${bill.legiscan_url ? `
        <div class="detail-row">
          <div class="detail-label">Legiscan</div>
          <div class="detail-value">${legiscanLink}</div>
        </div>` : ""}
      </div>
    </div>
  `;

  const pageTitle = `${stateName} ${bill.bill_number}`;
  return layout(pageTitle, content);
}
