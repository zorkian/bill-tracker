import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { app } from "../../src/index";
import { createBill } from "../../src/services/bills";
import { createSession } from "../../src/services/sessions";

async function authCookie(): Promise<string> {
  const token = await createSession(env.SESSIONS, { user_id: 1, username: "admin" });
  return `session=${token}`;
}

describe("admin routes", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("redirects to login without session", async () => {
    const res = await app.request("/admin", {}, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/login");
  });

  it("shows bill list when authenticated", async () => {
    const cookie = await authCookie();
    const res = await app.request("/admin", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Add Bill");
  });

  it("GET /admin/bills/new shows add form with categories", async () => {
    const cookie = await authCookie();
    const res = await app.request("/admin/bills/new", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Age Verification");
    expect(html).toContain("Parental Consent");
  });

  it("POST /admin/bills creates a bill and redirects to /admin", async () => {
    const cookie = await authCookie();
    const form = new URLSearchParams({
      state: "TX",
      bill_number: "HB 1234",
      title: "Test Bill",
      status_simple: "Introduced",
    });
    const res = await app.request("/admin/bills", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://localhost",
        "Cookie": cookie,
      },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/admin");
  });

  it("POST /admin/bills/:id updates a bill and redirects", async () => {
    const cookie = await authCookie();
    const bill = await createBill(env.DB, {
      state: "TX",
      bill_number: "HB 5678",
      status_simple: "Introduced",
      category_ids: [],
    });

    const form = new URLSearchParams({
      state: "TX",
      bill_number: "HB 5678",
      title: "Updated Title",
      status_simple: "Passed One Chamber",
    });
    const res = await app.request(`/admin/bills/${bill.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://localhost",
        "Cookie": cookie,
      },
      body: form.toString(),
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe(`/admin/bills/${bill.id}/edit`);
  });

  it("GET /admin/bills/:id/delete shows confirmation page", async () => {
    const cookie = await authCookie();
    const bill = await createBill(env.DB, {
      state: "CA",
      bill_number: "AB 999",
      status_simple: "Introduced",
      category_ids: [],
    });

    const res = await app.request(`/admin/bills/${bill.id}/delete`, {
      headers: { Cookie: cookie },
    }, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Delete Bill");
    expect(html).toContain("AB 999");
  });

  it("POST /admin/bills/:id/delete deletes and redirects to /admin", async () => {
    const cookie = await authCookie();
    const bill = await createBill(env.DB, {
      state: "FL",
      bill_number: "SB 42",
      status_simple: "Introduced",
      category_ids: [],
    });

    const res = await app.request(`/admin/bills/${bill.id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://localhost",
        "Cookie": cookie,
      },
    }, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/admin");
  });

  it("GET /admin/legiscan-lookup returns 400 without params", async () => {
    const cookie = await authCookie();
    const res = await app.request("/admin/legiscan-lookup", { headers: { Cookie: cookie } }, env);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });
});
