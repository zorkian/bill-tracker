import { describe, it, expect, vi, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { createBill } from "../../src/services/bills";
import { pollStatuses } from "../../src/cron/poll-statuses";

function mockGetBillResponse(overrides: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({
    status: "OK",
    bill: {
      bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test",
      status: 2, status_desc: "Engrossed", change_hash: "newhash",
      history: [
        { date: "2026-01-15", action: "Introduced", importance: 1 },
        { date: "2026-03-05", action: "Passed House", importance: 1 },
      ],
      session: { session_id: 2100 },
      ...overrides,
    },
  }));
}

describe("cron poll-statuses", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("updates active bills from Legiscan", async () => {
    await createBill(env.DB, {
      state: "AZ", bill_number: "HB 2991", status_simple: "Introduced",
      legiscan_bill_id: 12345, category_ids: [],
    });

    const mockFetch = vi.fn().mockResolvedValue(mockGetBillResponse());
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");
    const bill = await env.DB.prepare("SELECT * FROM bills WHERE id = 1").first();
    expect(bill!.status_simple).toBe("Passed One Chamber");
    expect(bill!.last_action_description).toBe("Passed House");
    expect(bill!.change_hash).toBe("newhash");
    expect(bill!.legiscan_session_id).toBe(2100);
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

  it("uses getMasterListRaw to skip unchanged bills", async () => {
    // Create a bill with a known session_id and change_hash
    await createBill(env.DB, {
      state: "AZ", bill_number: "HB 2991", status_simple: "Introduced",
      legiscan_bill_id: 12345, legiscan_session_id: 2100,
      change_hash: "samehash", category_ids: [],
    });

    // getMasterListRaw returns the same hash — bill should be skipped
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "OK",
      masterlist: {
        session: { session_id: 2100 },
        "0": { bill_id: 12345, change_hash: "samehash" },
      },
    })));
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");

    // Only 1 API call: getMasterListRaw. No getBillDetails call.
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("op=getMasterListRaw");

    vi.unstubAllGlobals();
  });

  it("fetches bill when change_hash differs", async () => {
    await createBill(env.DB, {
      state: "AZ", bill_number: "HB 2991", status_simple: "Introduced",
      legiscan_bill_id: 12345, legiscan_session_id: 2100,
      change_hash: "oldhash", category_ids: [],
    });

    const mockFetch = vi.fn()
      // getMasterListRaw returns a different hash
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "OK",
        masterlist: {
          session: { session_id: 2100 },
          "0": { bill_id: 12345, change_hash: "newhash" },
        },
      })))
      // getBillDetails for the changed bill
      .mockResolvedValueOnce(mockGetBillResponse());
    vi.stubGlobal("fetch", mockFetch);
    await pollStatuses(env.DB, "test-key");

    // 2 API calls: getMasterListRaw + getBillDetails
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const bill = await env.DB.prepare("SELECT * FROM bills WHERE id = 1").first();
    expect(bill!.status_simple).toBe("Passed One Chamber");
    expect(bill!.change_hash).toBe("newhash");

    vi.unstubAllGlobals();
  });
});
