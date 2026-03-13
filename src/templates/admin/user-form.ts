import { layout, escHtml } from "../layout";
import type { User } from "../../types";

type SafeUser = Omit<User, "password_hash">;

export function adminUserFormPage(options: {
  user?: SafeUser;
  error?: string;
  role: string;
}): string {
  const { user, error, role } = options;
  const isEdit = !!user;
  const pageTitle = "Admin - " + (isEdit ? "Edit" : "Add") + " User";
  const formAction = isEdit ? `/admin/users/${user.id}` : "/admin/users";

  const content = `
    <div class="page-header">
      <h1>${isEdit ? "Edit User" : "Add User"}</h1>
    </div>

    ${error ? `<div class="error-message">${escHtml(error)}</div>` : ""}

    <form method="POST" action="${formAction}">
      <div class="form-section">
        <h2>User Details</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="f-username">Username</label>
            <input type="text" id="f-username" name="username" value="${escHtml(user?.username ?? "")}" required minlength="1" maxlength="50" pattern="[a-zA-Z0-9_]+">
            <span class="form-hint">Letters, numbers, and underscores only.</span>
          </div>
          <div class="form-group">
            <label for="f-email">Email</label>
            <input type="email" id="f-email" name="email" value="${escHtml(user?.email ?? "")}">
          </div>
          <div class="form-group">
            <label for="f-role">Role</label>
            <select id="f-role" name="role" required>
              <option value="user"${user?.role === "user" || !user ? " selected" : ""}>User</option>
              <option value="admin"${user?.role === "admin" ? " selected" : ""}>Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label for="f-password">${isEdit ? "New Password (leave blank to keep current)" : "Password"}</label>
            <input type="password" id="f-password" name="password" ${isEdit ? "" : "required"} minlength="8">
            <span class="form-hint">Minimum 8 characters.</span>
          </div>
        </div>
      </div>

      ${isEdit ? '<p class="form-hint" style="margin-bottom:1rem;">Role changes take effect on next login.</p>' : ""}

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save User</button>
        <a href="/admin/users" class="btn btn-secondary">Cancel</a>
      </div>
    </form>
  `;

  return layout(pageTitle, content, { isAdmin: true, role });
}
