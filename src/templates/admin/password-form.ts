import { layout, escHtml } from "../layout";

export function adminPasswordFormPage(options: {
  error?: string;
  success?: string;
  role: string;
}): string {
  const { error, success, role } = options;

  const content = `
    <div class="page-header">
      <h1>Change Password</h1>
    </div>

    ${error ? `<div class="error-message">${escHtml(error)}</div>` : ""}
    ${success ? `<div class="info-box">${escHtml(success)}</div>` : ""}

    <form method="POST" action="/admin/password">
      <div class="form-section">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="f-current">Current Password</label>
            <input type="password" id="f-current" name="current_password" required>
          </div>
          <div class="form-group">
            <label for="f-new">New Password</label>
            <input type="password" id="f-new" name="new_password" required minlength="8">
            <span class="form-hint">Minimum 8 characters.</span>
          </div>
          <div class="form-group">
            <label for="f-confirm">Confirm New Password</label>
            <input type="password" id="f-confirm" name="confirm_password" required minlength="8">
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Change Password</button>
        <a href="/admin" class="btn btn-secondary">Cancel</a>
      </div>
    </form>
  `;

  return layout("Change Password", content, { isAdmin: true, role });
}
