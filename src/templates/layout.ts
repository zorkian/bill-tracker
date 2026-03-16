import { STATUS_COLORS, ENFORCEMENT_COLORS } from "../constants";

export function layout(title: string, content: string, options?: { isAdmin?: boolean; role?: string }): string {
  const isAdmin = options?.isAdmin;
  const role = options?.role;
  const statusColorCss = Object.entries(STATUS_COLORS).map(([status, colors]) => {
    const cls = status.toLowerCase().replace(/\s+/g, "-");
    return `.status-badge.status-${cls} { background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border}; }
.bill-card.border-${cls} { border-left-color: ${colors.border}; }`;
  }).join("\n");
  const enforcementColorCss = Object.entries(ENFORCEMENT_COLORS).map(([status, colors]) => {
    const cls = status.toLowerCase().replace(/\s+/g, "-");
    return `.status-badge.enforcement-${cls} { background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border}; }`;
  }).join("\n");

  const css = `
    :root {
      --bg: #f1f5f9; --fg: #1e293b; --link: #2563eb;
      --header-bg: #1e293b; --header-fg: #fff; --header-sub: #94a3b8;
      --nav-fg: #cbd5e1; --nav-hover-bg: #334155;
      --card-bg: #fff; --card-border: #e2e8f0; --card-hover-shadow: rgba(0,0,0,0.08);
      --muted: #64748b; --muted2: #94a3b8; --muted3: #475569;
      --input-bg: #fff; --input-border: #cbd5e1;
      --filter-bg: #f1f5f9; --filter-border: #cbd5e1;
      --table-header-bg: #f8fafc; --table-row-hover: #f8fafc; --table-border: #f1f5f9;
      --form-bg: #fff; --form-border: #e2e8f0; --form-section-border: #f1f5f9;
      --pill-bg: #e2e8f0; --pill-fg: #475569;
      --def-bg: #f8fafc; --def-border: #e2e8f0;
      --notes-bg: #fffbeb; --notes-border: #f59e0b; --notes-fg: #78350f; --notes-strong: #92400e;
      --error-bg: #fee2e2; --error-border: #fca5a5; --error-fg: #dc2626;
      --info-bg: #eff6ff; --info-border: #bfdbfe; --info-fg: #1d4ed8;
      --quick-add-bg: #f0fdf4; --quick-add-border: #86efac; --quick-add-fg: #15803d;
      --warning-bg: #fff7ed; --warning-border: #fed7aa; --warning-fg: #7c2d12; --warning-strong: #9a3412;
      --login-bg: #fff;
      --urgent-bg: #fef2f2; --urgent-border: #dc2626;
    }
    [data-theme="dark"] {
      --bg: #0f172a; --fg: #e2e8f0; --link: #60a5fa;
      --header-bg: #020617; --header-fg: #f1f5f9; --header-sub: #64748b;
      --nav-fg: #94a3b8; --nav-hover-bg: #1e293b;
      --card-bg: #1e293b; --card-border: #334155; --card-hover-shadow: rgba(0,0,0,0.3);
      --muted: #94a3b8; --muted2: #64748b; --muted3: #cbd5e1;
      --input-bg: #1e293b; --input-border: #475569;
      --filter-bg: #1e293b; --filter-border: #475569;
      --table-header-bg: #1e293b; --table-row-hover: #1e293b; --table-border: #334155;
      --form-bg: #1e293b; --form-border: #334155; --form-section-border: #334155;
      --pill-bg: #334155; --pill-fg: #cbd5e1;
      --def-bg: #1e293b; --def-border: #334155;
      --notes-bg: #1c1a0e; --notes-border: #854d0e; --notes-fg: #fcd34d; --notes-strong: #fbbf24;
      --error-bg: #2a1215; --error-border: #991b1b; --error-fg: #fca5a5;
      --info-bg: #0c1929; --info-border: #1e40af; --info-fg: #93c5fd;
      --quick-add-bg: #0d1f12; --quick-add-border: #166534; --quick-add-fg: #86efac;
      --warning-bg: #1c1408; --warning-border: #92400e; --warning-fg: #fed7aa; --warning-strong: #fbbf24;
      --login-bg: #1e293b;
      --urgent-bg: #2a1215; --urgent-border: #991b1b;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--fg); min-height: 100vh; display: flex; flex-direction: column; }
    a { color: var(--link); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Header */
    header { background: var(--header-bg); color: var(--header-fg); padding: 0 1.5rem; }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; min-height: 60px; flex-wrap: wrap; gap: 0.5rem; padding: 0.75rem 0; }
    .header-brand { display: flex; align-items: center; gap: 0.75rem; }
    .header-title { font-size: 1.25rem; font-weight: 700; color: var(--header-fg); }
    .header-title a { color: var(--header-fg); text-decoration: none; }
    .admin-badge { background: #f59e0b; color: #1e293b; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .header-subtitle { font-size: 0.875rem; color: var(--header-sub); }
    nav { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    nav a { color: var(--nav-fg); font-size: 0.875rem; text-decoration: none; padding: 0.25rem 0.5rem; border-radius: 4px; transition: background 0.15s; }
    nav a:hover { background: var(--nav-hover-bg); color: var(--header-fg); text-decoration: none; }
    nav a.logout { color: #fca5a5; }
    nav a.logout:hover { background: #7f1d1d; color: #fff; }

    /* Theme toggle */
    .theme-toggle { background: none; border: none; color: var(--nav-fg); cursor: pointer; font-size: 1.2rem; padding: 0.25rem 0.4rem; border-radius: 4px; transition: background 0.15s; line-height: 1; }
    .theme-toggle:hover { background: var(--nav-hover-bg); color: var(--header-fg); }

    /* Main */
    main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 1.5rem; }

    /* Footer */
    footer { background: var(--header-bg); color: var(--muted); text-align: center; padding: 1rem 1.5rem; font-size: 0.8rem; margin-top: auto; }
    footer a { color: var(--muted2); }
    footer a:hover { color: var(--nav-fg); }

    /* US Map */
    #us-map { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    #us-map svg { width: 100%; height: auto; max-height: 400px; }

    /* Filter bar */
    .filter-bar { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
    .filter-group { display: flex; flex-direction: column; gap: 0.25rem; min-width: 150px; flex: 1; }
    .filter-group label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .filter-group select, .filter-group input { border: 1px solid var(--input-border); border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.875rem; background: var(--input-bg); color: var(--fg); width: 100%; }
    .filter-group select:focus, .filter-group input:focus { outline: 2px solid #2563eb; outline-offset: 1px; border-color: #2563eb; }
    .filter-reset { align-self: flex-end; background: var(--filter-bg); border: 1px solid var(--filter-border); color: var(--muted3); font-size: 0.875rem; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; white-space: nowrap; }
    .filter-reset:hover { background: var(--card-border); }

    /* Stats bar */
    .stats-bar { display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .stat-item { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.85rem; color: var(--muted3); }
    .stat-item strong { color: var(--fg); font-size: 1rem; }
    .stat-item .stat-label { font-size: 0.75rem; }

    /* Bill cards */
    .bills-grid { display: flex; flex-direction: column; gap: 1rem; }
    .bill-card { background: var(--card-bg); border: 1px solid var(--card-border); border-left: 4px solid var(--muted2); border-radius: 8px; padding: 1rem 1.25rem; text-decoration: none; color: inherit; display: block; transition: box-shadow 0.15s; }
    .bill-card:hover { box-shadow: 0 2px 8px var(--card-hover-shadow); text-decoration: none; }
    .bill-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
    .bill-card-title { font-size: 1rem; font-weight: 700; color: var(--fg); flex: 1; min-width: 0; }
    .bill-card-subtitle { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.5rem; }
    .bill-card-name { font-size: 0.875rem; color: var(--muted3); margin-bottom: 0.6rem; }
    .bill-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--form-section-border); flex-wrap: wrap; font-size: 0.75rem; color: var(--muted2); }
    .bill-card-footer a { font-size: 0.75rem; }

    /* Status badge */
    .status-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 9999px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.04em; }
    ${statusColorCss}
    ${enforcementColorCss}

    /* Action alert */
    .action-alert-badge { background: #dc2626; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; vertical-align: middle; margin-right: 0.35rem; }

    /* Category pills */
    .category-pills { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.6rem; }
    .category-pill { background: var(--pill-bg); color: var(--pill-fg); font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 9999px; white-space: nowrap; }

    /* Definition box */
    .definition-box { background: var(--def-bg); border: 1px solid var(--def-border); border-radius: 6px; padding: 0.6rem 0.75rem; margin-bottom: 0.6rem; font-size: 0.8rem; color: var(--muted3); }
    .definition-box strong { color: var(--muted); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }

    /* Notes callout */
    .notes-callout { background: var(--notes-bg); border: 1px solid var(--notes-border); border-radius: 6px; padding: 0.6rem 0.75rem; margin-bottom: 0.6rem; font-size: 0.8rem; color: var(--notes-fg); }
    .notes-callout strong { color: var(--notes-strong); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }

    /* No results */
    .no-bills { display: none; text-align: center; padding: 3rem; color: var(--muted2); font-size: 1rem; }

    /* Admin table */
    .admin-table { width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: 8px; overflow: hidden; border: 1px solid var(--card-border); font-size: 0.875rem; }
    .admin-table th { background: var(--table-header-bg); color: var(--muted3); font-weight: 600; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid var(--card-border); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .admin-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--table-border); vertical-align: middle; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover td { background: var(--table-row-hover); }
    .admin-table a { color: var(--link); }

    /* Buttons */
    .btn { display: inline-block; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: background 0.15s; }
    .btn:hover { text-decoration: none; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-primary:hover { background: #1d4ed8; color: #fff; }
    .btn-danger { background: var(--card-bg); color: #dc2626; border: 1px solid #fca5a5; }
    .btn-danger:hover { background: var(--error-bg); color: #b91c1c; border-color: #dc2626; }
    .btn-secondary { background: var(--filter-bg); color: var(--muted3); border: 1px solid var(--filter-border); }
    .btn-secondary:hover { background: var(--card-border); color: var(--fg); }
    .btn-sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }

    /* Form elements */
    .form-section { background: var(--form-bg); border: 1px solid var(--form-border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; }
    .form-section h2 { font-size: 0.875rem; font-weight: 700; color: var(--muted3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--form-section-border); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--muted3); }
    .form-group input, .form-group select, .form-group textarea { border: 1px solid var(--input-border); border-radius: 4px; padding: 0.45rem 0.6rem; font-size: 0.875rem; color: var(--fg); background: var(--input-bg); width: 100%; font-family: inherit; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: 2px solid #2563eb; outline-offset: 1px; border-color: #2563eb; }
    .form-group textarea { resize: vertical; min-height: 80px; }
    .form-hint { font-size: 0.75rem; color: var(--muted2); }

    /* Checkbox grid */
    .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
    .checkbox-item { display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.8rem; color: var(--muted3); cursor: pointer; }
    .checkbox-item input[type=checkbox] { margin-top: 0.1rem; flex-shrink: 0; }

    /* Error/info messages */
    .error-message { background: var(--error-bg); border: 1px solid var(--error-border); border-radius: 6px; padding: 0.6rem 0.75rem; color: var(--error-fg); font-size: 0.875rem; margin-bottom: 1rem; }
    .info-box { background: var(--info-bg); border: 1px solid var(--info-border); border-radius: 6px; padding: 0.6rem 0.75rem; color: var(--info-fg); font-size: 0.875rem; margin-bottom: 1rem; }

    /* Quick add box */
    .quick-add-box { background: var(--quick-add-bg); border: 1px solid var(--quick-add-border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; }
    .quick-add-box h2 { font-size: 0.875rem; font-weight: 700; color: var(--quick-add-fg); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
    .quick-add-row { display: flex; gap: 0.75rem; align-items: flex-end; flex-wrap: wrap; }
    .quick-add-row .form-group { flex: 1; min-width: 120px; }
    .quick-add-status { margin-top: 0.5rem; font-size: 0.8rem; color: var(--muted); min-height: 1.2em; }

    /* Page title row */
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem; }
    .page-header h1 { font-size: 1.25rem; font-weight: 700; color: var(--fg); }

    /* Bill detail */
    .detail-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 1.5rem; }
    .detail-row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; align-items: flex-start; }
    .detail-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; min-width: 140px; padding-top: 0.1rem; }
    .detail-value { font-size: 0.875rem; color: var(--fg); flex: 1; }
    .back-link { font-size: 0.875rem; color: var(--muted); margin-bottom: 1rem; display: inline-block; }
    .back-link:hover { color: var(--fg); }

    /* Login form */
    .login-wrap { max-width: 360px; margin: 3rem auto; }
    .login-card { background: var(--login-bg); border: 1px solid var(--card-border); border-radius: 8px; padding: 2rem; }
    .login-card h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--fg); }

    /* Warning box */
    .warning-box { background: var(--warning-bg); border: 1px solid var(--warning-border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; color: var(--warning-fg); }
    .warning-box h2 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--warning-strong); }
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

  // Inline script runs before paint to avoid flash of wrong theme
  const themeScript = `<script>
(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')})();
</script>`;

  const toggleScript = `<script>
function toggleTheme(){var d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n==='dark'?'dark':'');if(n==='dark')d.setAttribute('data-theme','dark');else d.removeAttribute('data-theme');localStorage.setItem('theme',n);document.getElementById('theme-icon').textContent=n==='dark'?'\\u2600\\uFE0F':'\\u{1F319}'}
</script>`;

  const themeIcon = `<button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode"><span id="theme-icon">\u{1F319}</span></button>`;

  // Small inline script to set correct icon on load
  const iconFixScript = `<script>
(function(){var d=document.documentElement.getAttribute('data-theme');document.getElementById('theme-icon').textContent=d==='dark'?'\\u2600\\uFE0F':'\\u{1F319}'})();
</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} — Social Media Bill Tracker</title>
  ${themeScript}
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
      <div style="display:flex;align-items:center;gap:0.5rem;">
        ${isAdmin ? adminNav : ""}
        ${themeIcon}
      </div>
    </div>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>A project by <a href="https://www.dreamwidth.org/" target="_blank" rel="noopener">Dreamwidth Studios</a></p>
    <p style="margin-top:0.35rem">Legislative data provided by <a href="https://legiscan.com/" target="_blank" rel="noopener">LegiScan</a> under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a></p>
  </footer>
  ${toggleScript}
  ${iconFixScript}
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
