import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { app } from "../../src/index";
import { createSession } from "../../src/services/sessions";
import { createUser, verifyUser } from "../../src/services/users";

describe("password change routes", () => {
  let cookie: string;
  let userId: number;

  beforeEach(async () => {
    await setupTestDb();
    const user = await createUser(env.DB, { username: "passuser", password: "oldpass12", role: "user" });
    userId = user.id;
    const token = await createSession(env.SESSIONS, { user_id: user.id, username: "passuser", role: "user" });
    cookie = `session=${token}`;
  });

  it("GET /admin/password shows password form", async () => {
    const res = await app.request("/admin/password", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Change Password");
    expect(html).toContain("Current Password");
  });

  it("POST /admin/password changes password with valid current", async () => {
    const form = new URLSearchParams({ current_password: "oldpass12", new_password: "newpass12", confirm_password: "newpass12" });
    const res = await app.request("/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Password changed");
    const verified = await verifyUser(env.DB, "passuser", "newpass12");
    expect(verified).not.toBeNull();
  });

  it("POST /admin/password rejects wrong current password", async () => {
    const form = new URLSearchParams({ current_password: "wrongpass", new_password: "newpass12", confirm_password: "newpass12" });
    const res = await app.request("/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Current password is incorrect");
  });

  it("POST /admin/password rejects mismatched passwords", async () => {
    const form = new URLSearchParams({ current_password: "oldpass12", new_password: "newpass12", confirm_password: "different" });
    const res = await app.request("/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost", Cookie: cookie },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("do not match");
  });
});
