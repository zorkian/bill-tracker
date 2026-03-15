import { describe, it, expect, vi } from "vitest";
import { searchBill, getBillDetails, getMasterListRaw, mapLegiscanStatus } from "../../src/services/legiscan";

describe("legiscan service", () => {
  it("maps legiscan status codes to simple statuses", () => {
    expect(mapLegiscanStatus(1)).toBe("Introduced");
    expect(mapLegiscanStatus(2)).toBe("Passed One Chamber");
    expect(mapLegiscanStatus(3)).toBe("Passed Both Chambers");
    expect(mapLegiscanStatus(4)).toBe("Passed Both Chambers");
    expect(mapLegiscanStatus(5)).toBe("Vetoed");
    expect(mapLegiscanStatus(6)).toBe("Failed");
    expect(mapLegiscanStatus(0)).toBeNull();
    expect(mapLegiscanStatus(99)).toBeNull();
  });

  it("searchBill parses Legiscan API response", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "OK",
        searchresult: {
          summary: { count: 1 },
          "0": { bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test Bill" },
        },
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        status: "OK",
        bill: {
          bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test Bill",
          status: 1, status_desc: "Introduced", change_hash: "abc123def456",
          url: "https://legiscan.com/AZ/bill/HB2991/2026",
          history: [{ date: "2026-01-15", action: "Introduced", importance: 1 }],
          session: { session_id: 2100 },
        },
      })));
    vi.stubGlobal("fetch", mockFetch);

    const result = await searchBill("test-api-key", "AZ", "HB 2991");
    expect(result).not.toBeNull();
    expect(result!.legiscan_bill_id).toBe(12345);
    expect(result!.status_simple).toBe("Introduced");
    expect(result!.change_hash).toBe("abc123def456");
    expect(result!.session_id).toBe(2100);

    vi.unstubAllGlobals();
  });

  it("getBillDetails returns change_hash and session_id", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "OK",
      bill: {
        bill_id: 12345, state: "AZ", bill_number: "HB2991", title: "Test",
        status: 2, status_desc: "Engrossed", change_hash: "hash999",
        history: [{ date: "2026-01-15", action: "Introduced", importance: 1 }],
        session: { session_id: 2100, end_date: "2026-06-30" },
      },
    })));
    vi.stubGlobal("fetch", mockFetch);

    const result = await getBillDetails("test-key", 12345);
    expect(result!.change_hash).toBe("hash999");
    expect(result!.session_id).toBe(2100);
    expect(result!.session_end_date).toBe("2026-06-30");

    vi.unstubAllGlobals();
  });

  it("getMasterListRaw returns bill entries with hashes", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "OK",
      masterlist: {
        session: { session_id: 2100 },
        "0": { bill_id: 111, change_hash: "aaa" },
        "1": { bill_id: 222, change_hash: "bbb" },
      },
    })));
    vi.stubGlobal("fetch", mockFetch);

    const entries = await getMasterListRaw("test-key", 2100);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({ bill_id: 111, change_hash: "aaa" });
    expect(entries[1]).toEqual({ bill_id: 222, change_hash: "bbb" });

    vi.unstubAllGlobals();
  });

  it("getMasterListRaw returns empty array on error", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "ERROR",
      alert: { message: "Invalid session" },
    })));
    vi.stubGlobal("fetch", mockFetch);

    const entries = await getMasterListRaw("test-key", 9999);
    expect(entries).toEqual([]);

    vi.unstubAllGlobals();
  });
});
