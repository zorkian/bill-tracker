import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { app } from "../../src/index";
import { createSession } from "../../src/services/sessions";
import { createUser } from "../../src/services/users";

async function adminCookie(): Promise<string> {
  const user = await createUser(env.DB, { username: "admin", password: "adminpass", role: "admin" });
  const token = await createSession(env.SESSIONS, { user_id: user.id, username: "admin", role: "admin" });
  return `session=${token}`;
}

async function userCookie(): Promise<string> {
  const user = await createUser(env.DB, { username: "editor", password: "editpass", role: "user" });
  const token = await createSession(env.SESSIONS, { user_id: user.id, username: "editor", role: "user" });
  return `session=${token}`;
}

describe("user management routes", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("GET /admin/users returns 403 for non-admin", async () => {
    const cookie = await userCookie();
    const res = await app.request("/admin/users", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(403);
  });

  it("GET /admin/users shows user list for admin", async () => {
    const cookie = await adminCookie();
    const res = await app.request("/admin/users", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Add User");
    expect(html).toContain("admin");
  });

  it("GET /admin/users/new shows create form", async () => {
    const cookie = await adminCookie();
    const res = await app.request("/admin/users/new", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Add User");
  });

  it("POST /admin/users creates a user and redirects", async () => {
    const cookie = await adminCookie();
    const form = new URLSearchParams({ username: "newuser", email: "new@example.com", password: "password123", role: "user" });
    const res = await app.request("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/admin/users");
  });

  it("POST /admin/users rejects short password", async () => {
    const cookie = await adminCookie();
    const form = new URLSearchParams({ username: "newuser", password: "short", role: "user" });
    const res = await app.request("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("8 characters");
  });

  it("POST /admin/users/:id/delete deletes user and redirects", async () => {
    const cookie = await adminCookie();
    const target = await createUser(env.DB, { username: "deleteme", password: "password123", role: "user" });
    const res = await app.request(`/admin/users/${target.id}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/admin/users");
  });

  it("GET /admin/users/:id/edit shows edit form", async () => {
    const cookie = await adminCookie();
    const target = await createUser(env.DB, { username: "editme", password: "password123", role: "user" });
    const res = await app.request(`/admin/users/${target.id}/edit`, { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Edit User");
    expect(html).toContain("editme");
  });

  it("GET /admin/users/:id/edit returns 404 for nonexistent user", async () => {
    const cookie = await adminCookie();
    const res = await app.request("/admin/users/99999/edit", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(404);
  });

  it("POST /admin/users/:id blocks demoting the last admin", async () => {
    const cookie = await adminCookie();
    const admin = await env.DB.prepare("SELECT id FROM users WHERE username = 'admin'").first<{ id: number }>();
    const form = new URLSearchParams({ username: "admin", role: "user" });
    const res = await app.request(`/admin/users/${admin!.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Cannot demote the last admin");
  });

  it("POST /admin/users/:id/delete blocks self-deletion", async () => {
    const admin = await createUser(env.DB, { username: "selfadmin", password: "adminpass", role: "admin" });
    const token = await createSession(env.SESSIONS, { user_id: admin.id, username: "selfadmin", role: "admin" });
    const cookie = `session=${token}`;
    const res = await app.request(`/admin/users/${admin.id}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
    }, env);
    expect(res.status).toBe(302);
    const check = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(admin.id).first();
    expect(check).not.toBeNull();
  });
});
