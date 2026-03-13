import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { Hono } from "hono";
import { setupTestDb } from "../helpers/setup";
import { createBill } from "../../src/services/bills";
import { pub } from "../../src/routes/public";

const testApp = new Hono();
testApp.route("/", pub);

describe("public routes", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("GET / returns bill tracker page", async () => {
    await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", title: "Test bill", status_simple: "Introduced", category_ids: [1] });
    const res = await testApp.request("/", {}, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("HB 2991");
    expect(html).toContain("Social Media Bill Tracker");
  });

  it("GET /bill/:id returns bill detail", async () => {
    const bill = await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", title: "Test bill", status_simple: "Introduced", category_ids: [1] });
    const res = await testApp.request(`/bill/${bill.id}`, {}, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("HB 2991");
  });

  it("GET /bill/999 returns 404", async () => {
    const res = await testApp.request("/bill/999", {}, env);
    expect(res.status).toBe(404);
  });
});
