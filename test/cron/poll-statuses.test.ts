import { describe, it, expect, vi, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { createBill } from "../../src/services/bills";
import { pollStatuses } from "../../src/cron/poll-statuses";

describe("cron poll-statuses", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("updates active bills from Legiscan", async () => {
    await createBill(env.DB, {
      state: "AZ", bill_number: "HB 2991", status_simple: "Introduced",
      legiscan_bill_id: 12345, category_ids: [],
    });

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        status: "OK",
        bill: {
          bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test",
          status: 2, status_desc: "Engrossed",
          history: [
            { date: "2026-01-15", action: "Introduced", importance: 1 },
            { date: "2026-03-05", action: "Passed House", importance: 1 },
          ],
          session: {},
        },
      }))
    );
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    const bill = await env.DB.prepare("SELECT * FROM bills WHERE id = 1").first();
    expect(bill!.status_simple).toBe("Passed One Chamber");
    expect(bill!.last_action_description).toBe("Passed House");
    vi.unstubAllGlobals();
  });

  it("skips bills without legiscan_bill_id", async () => {
    await createBill(env.DB, { state: "CA", bill_number: "AB 1709", status_simple: "Introduced", category_ids: [] });
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    expect(mockFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("skips terminal-status bills", async () => {
    await createBill(env.DB, {
      state: "IN", bill_number: "HB 1408", status_simple: "Signed Into Law",
      legiscan_bill_id: 99999, category_ids: [],
    });
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    expect(mockFetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
