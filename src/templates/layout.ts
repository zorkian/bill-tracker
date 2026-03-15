import { STATUS_COLORS } from "../constants";

export function layout(title: string, content: string, options?: { isAdmin?: boolean; role?: string }): string {
  const isAdmin = options?.isAdmin;
  const role = options?.role;
  const statusColorCss = Object.entries(STATUS_COLORS).map(([status, colors]) => {
    const cls = status.toLowerCase().replace(/\s+/g, "-");
    return `.status-badge.status-${cls} { background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border}; }
.bill-card.border-${cls} { border-left-color: ${colors.border}; }`;
  }).join("\n");

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; color: #1e293b; min-height: 100vh; display: flex; flex-direction: column; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Header */
    header { background: #1e293b; color: #fff; padding: 0 1.5rem; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; min-height: 60px; flex-wrap: wrap; gap: 0.5rem; padding: 0.75rem 0; }
    .header-brand { display: flex; align-items: center; gap: 0.75rem; }
    .header-title { font-size: 1.25rem; font-weight: 700; color: #fff; }
    .header-title a { color: #fff; text-decoration: none; }
    .admin-badge { background: #f59e0b; color: #1e293b; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .header-subtitle { font-size: 0.875rem; color: #94a3b8; }
    nav { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    nav a { color: #cbd5e1; font-size: 0.875rem; text-decoration: none; padding: 0.25rem 0.5rem; border-radius: 4px; transition: background 0.15s; }
    nav a:hover { background: #334155; color: #fff; text-decoration: none; }
    nav a.logout { color: #fca5a5; }
    nav a.logout:hover { background: #7f1d1d; color: #fff; }

    /* Main */
    main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 1.5rem; }

    /* Footer */
    footer { background: #1e293b; color: #64748b; text-align: center; padding: 1rem 1.5rem; font-size: 0.8rem; margin-top: auto; }
    footer a { color: #94a3b8; }
    footer a:hover { color: #cbd5e1; }

    /* US Map */
    #us-map { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    #us-map svg { width: 100%; height: auto; max-height: 400px; }

    /* Filter bar */
    .filter-bar { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
    .filter-group { display: flex; flex-direction: column; gap: 0.25rem; min-width: 150px; flex: 1; }
    .filter-group label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .filter-group select, .filter-group input { border: 1px solid #cbd5e1; border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.875rem; background: #fff; color: #1e293b; width: 100%; }
    .filter-group select:focus, .filter-group input:focus { outline: 2px solid #2563eb; outline-offset: 1px; border-color: #2563eb; }
    .filter-reset { align-self: flex-end; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 0.875rem; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; white-space: nowrap; }
    .filter-reset:hover { background: #e2e8f0; }

    /* Stats bar */
    .stats-bar { display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .stat-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.85rem; color: #475569; }
    .stat-item strong { color: #1e293b; font-size: 1rem; }
    .stat-item .stat-label { font-size: 0.75rem; }

    /* Bill cards */
    .bills-grid { display: flex; flex-direction: column; gap: 1rem; }
    .bill-card { background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #94a3b8; border-radius: 8px; padding: 1rem 1.25rem; text-decoration: none; color: inherit; display: block; transition: box-shadow 0.15s; }
    .bill-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-decoration: none; }
    .bill-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
    .bill-card-title { font-size: 1rem; font-weight: 700; color: #1e293b; flex: 1; min-width: 0; }
    .bill-card-subtitle { font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
    .bill-card-name { font-size: 0.875rem; color: #475569; margin-bottom: 0.6rem; }
    .bill-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; flex-wrap: wrap; font-size: 0.75rem; color: #94a3b8; }
    .bill-card-footer a { font-size: 0.75rem; }

    /* Status badge */
    .status-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 9999px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.04em; }
    ${statusColorCss}

    /* Action alert */
    .action-alert-badge { background: #dc2626; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; vertical-align: middle; margin-right: 0.35rem; }

    /* Category pills */
    .category-pills { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.6rem; }
    .category-pill { background: #e2e8f0; color: #475569; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 9999px; white-space: nowrap; }

    /* Definition box */
    .definition-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.6rem 0.75rem; margin-bottom: 0.6rem; font-size: 0.8rem; color: #475569; }
    .definition-box strong { color: #64748b; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }

    /* Notes callout */
    .notes-callout { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 6px; padding: 0.6rem 0.75rem; margin-bottom: 0.6rem; font-size: 0.8rem; color: #78350f; }
    .notes-callout strong { color: #92400e; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }

    /* No results */
    .no-bills { display: none; text-align: center; padding: 3rem; color: #94a3b8; font-size: 1rem; }

    /* Admin table */
    .admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 0.875rem; }
    .admin-table th { background: #f8fafc; color: #475569; font-weight: 600; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .admin-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover td { background: #f8fafc; }
    .admin-table a { color: #2563eb; }

    /* Buttons */
    .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: background 0.15s; }
    .btn:hover { text-decoration: none; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; color: #fff; }
    .btn-danger { background: #fff; color: #dc2626; border: 1px solid #fca5a5; }
    .btn-danger:hover { background: #fef2f2; color: #b91c1c; border-color: #dc2626; }
    .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
    .btn-sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }

    /* Form elements */
    .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; }
    .form-section h2 { font-size: 0.875rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .form-group input, .form-group select, .form-group textarea { border: 1px solid #cbd5e1; border-radius: 4px; padding: 0.45rem 0.6rem; font-size: 0.875rem; color: #1e293b; background: #fff; width: 100%; font-family: inherit; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: 2px solid #2563eb; outline-offset: 1px; border-color: #2563eb; }
    .form-group textarea { resize: vertical; min-height: 80px; }
    .form-hint { font-size: 0.75rem; color: #94a3b8; }

    /* Checkbox grid */
    .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
    .checkbox-item { display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.8rem; color: #475569; cursor: pointer; }
    .checkbox-item input[type=checkbox] { margin-top: 0.1rem; flex-shrink: 0; }

    /* Error/info messages */
    .error-message { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 0.6rem 0.75rem; color: #dc2626; font-size: 0.875rem; margin-bottom: 1rem; }
    .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 0.6rem 0.75rem; color: #1d4ed8; font-size: 0.875rem; margin-bottom: 1rem; }

    /* Quick add box */
    .quick-add-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; }
    .quick-add-box h2 { font-size: 0.875rem; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
    .quick-add-row { display: flex; gap: 0.75rem; align-items: flex-end; flex-wrap: wrap; }
    .quick-add-row .form-group { flex: 1; min-width: 120px; }
    .quick-add-status { margin-top: 0.5rem; font-size: 0.8rem; color: #64748b; min-height: 1.2em; }

    /* Page title row */
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem; }
    .page-header h1 { font-size: 1.25rem; font-weight: 700; color: #1e293b; }

    /* Bill detail */
    .detail-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
    .detail-row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; align-items: flex-start; }
    .detail-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px; padding-top: 0.1rem; }
    .detail-value { font-size: 0.875rem; color: #1e293b; flex: 1; }
    .back-link { font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; display: inline-block; }
    .back-link:hover { color: #1e293b; }

    /* Login form */
    .login-wrap { max-width: 360px; margin: 3rem auto; }
    .login-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2rem; }
    .login-card h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; color: #1e293b; }

    /* Warning box */
    .warning-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; color: #7c2d12; }
    .warning-box h2 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: #9a3412; }
    .form-actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; }

    @media (max-width: 768px) {
      .filter-bar { flex-direction: column; }
      .filter-group { min-width: unset; }
      .form-grid { grid-template-columns: 1fr; }
      .checkbox-grid { grid-template-columns: 1fr; }
      .quick-add-row { flex-direction: column; }
      .quick-add-row .form-group { min-width: unset; }
      .detail-row { flex-direction: column; }
      .detail-label { min-width: unset; }
      .bill-card-footer { flex-direction: column; align-items: flex-start; }
      .stats-bar { gap: 0.5rem; }
      main { padding: 1rem; }
    }
  `;

  const adminNav = `
    <nav>
      <a href="/admin">Bills</a>
      ${role === "admin" ? '<a href="/admin/categories">Categories</a>' : ""}
      ${role === "admin" ? '<a href="/admin/users">Users</a>' : ""}
      <a href="/admin/password">Password</a>
      <a href="/" target="_blank">View Site</a>
      <a href="/logout" class="logout" onclick="return confirm('Log out?')">Logout</a>
    </nav>
  `;

  const publicSubtitle = `<span class="header-subtitle">Tracking state legislation affecting social media platforms</span>`;

  const filterScript = isAdmin ? "" : `<script src="/static/us-map.js" defer></script>
  <script src="/static/filter.js" defer></script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} — Social Media Bill Tracker</title>
  <style>${css}</style>
  ${filterScript}
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="header-brand">
        <div>
          <div class="header-title"><a href="${isAdmin ? "/admin" : "/"}">Social Media Bill Tracker</a>${isAdmin ? ' <span class="admin-badge">Admin</span>' : ""}</div>
          ${isAdmin ? "" : publicSubtitle}
        </div>
      </div>
      ${isAdmin ? adminNav : ""}
    </div>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>A project by <a href="https://www.dreamwidth.org/" target="_blank" rel="noopener">Dreamwidth Studios</a></p>
    <p style="margin-top:0.35rem">Legislative data provided by <a href="https://legiscan.com/" target="_blank" rel="noopener">LegiScan</a> under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a></p>
  </footer>
</body>
</html>`;
}

export function escHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function statusClass(status: string): string {
  return "status-" + status.toLowerCase().replace(/\s+/g, "-");
}
