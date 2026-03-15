import { layout, escHtml } from "../layout";
import type { Category } from "../../types";

export function adminCategoryListPage(categories: Category[], options?: { error?: string; role?: string }): string {
  const rows = categories.map(cat => `
    <tr>
      <td>
        <form method="POST" action="/admin/categories/${cat.id}" style="display:flex;gap:0.5rem;align-items:center;">
          <input type="text" name="name" value="${escHtml(cat.name)}" style="border:1px solid #cbd5e1;border-radius:4px;padding:0.3rem 0.5rem;font-size:0.85rem;flex:1;">
          <button type="submit" class="btn btn-secondary btn-sm">Rename</button>
        </form>
      </td>
      <td style="color:#94a3b8;font-size:0.8rem">${cat.id}</td>
      <td>
        <form method="POST" action="/admin/categories/${cat.id}/delete" style="display:inline" onsubmit="return confirm('Delete category \\'${escHtml(cat.name).replace(/'/g, "\\\\'")}\\' and remove it from all bills?')">
          <button type="submit" class="btn btn-danger btn-sm">Delete</button>
        </form>
      </td>
    </tr>
  `).join("");

  const emptyRow = categories.length === 0
    ? `<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:2rem">No categories yet.</td></tr>`
    : "";

  const content = `
    <div class="page-header">
      <h1>Categories</h1>
    </div>

    ${options?.error ? `<div class="error-message">${escHtml(options.error)}</div>` : ""}

    <div class="form-section" style="margin-bottom:1.25rem">
      <h2>Add Category</h2>
      <form method="POST" action="/admin/categories" style="display:flex;gap:0.75rem;align-items:flex-end;">
        <div class="form-group" style="flex:1">
          <label for="f-cat-name">Name</label>
          <input type="text" id="f-cat-name" name="name" placeholder="e.g. Mandatory Third-Party Audits" required>
        </div>
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        ${emptyRow}
      </tbody>
    </table>
  `;

  return layout("Admin - Categories", content, { isAdmin: true, role: options?.role });
}
