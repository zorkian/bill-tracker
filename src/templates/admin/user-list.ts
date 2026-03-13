import { layout, escHtml } from "../layout";
import type { User } from "../../types";

type SafeUser = Omit<User, "password_hash">;

export function adminUserListPage(users: SafeUser[], currentUserId: number, role: string): string {
  const rows = users.map(u => `
    <tr>
      <td>${escHtml(u.username)}</td>
      <td>${escHtml(u.email ?? "—")}</td>
      <td><span class="role-badge role-${u.role}">${escHtml(u.role)}</span></td>
      <td>${escHtml(u.created_at?.slice(0, 10) ?? "")}</td>
      <td>
        <a href="/admin/users/${u.id}/edit" class="btn btn-secondary btn-sm">Edit</a>
        ${u.id !== currentUserId ? `
          <form method="POST" action="/admin/users/${u.id}/delete" style="display:inline" onsubmit="return confirm('Delete user ${escHtml(u.username)}?')">
            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
          </form>
        ` : ""}
      </td>
    </tr>
  `).join("");

  const content = `
    <div class="page-header">
      <h1>Users</h1>
      <a href="/admin/users/new" class="btn btn-primary">Add User</a>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  return layout("Admin - Users", content, { isAdmin: true, role });
}
