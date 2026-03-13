import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import bcrypt from "bcryptjs";
import { setupTestDb } from "../helpers/setup";
import { app } from "../../src/index";

describe("auth routes", () => {
  beforeEach(async () => {
    const db = await setupTestDb();
    const hash = await bcrypt.hash("testpass", 10);
    await db.prepare("INSERT OR REPLACE INTO users (username, password_hash) VALUES (?, ?)").bind("admin", hash).run();
  });

  it("GET /login returns login form", async () => {
    const res = await app.request("/login", {}, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("username");
    expect(html).toContain("password");
  });

  it("POST /login with valid credentials redirects to /admin", async () => {
    const form = new URLSearchParams({ username: "admin", password: "testpass" });
    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost" },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/admin");
    expect(res.headers.get("Set-Cookie")).toContain("session=");
  });

  it("POST /login with wrong password shows error", async () => {
    const form = new URLSearchParams({ username: "admin", password: "wrong" });
    const res = await app.request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Origin": "http://localhost" },
      body: form.toString(),
    }, env);
    const html = await res.text();
    expect(html).toContain("Invalid username or password");
  });
});
