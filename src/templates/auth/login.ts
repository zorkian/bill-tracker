import { layout, escHtml } from "../layout";

export function loginPage(error?: string): string {
  const content = `
    <div class="login-wrap">
      <div class="login-card">
        <h1>Admin Login</h1>
        ${error ? `<div class="error-message">${escHtml(error)}</div>` : ""}
        <form method="POST" action="/login">
          <div class="form-group" style="margin-bottom:0.75rem">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" autocomplete="username" required autofocus>
          </div>
          <div class="form-group" style="margin-bottom:1.25rem">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" autocomplete="current-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Log In</button>
        </form>
      </div>
    </div>
  `;
  return layout("Login", content);
}
