import { describe, it, expect, vi } from "vitest";
import { searchBill, mapLegiscanStatus } from "../../src/services/legiscan";

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
          status: 1, status_desc: "Introduced",
          url: "https://legiscan.com/AZ/bill/HB2991/2026",
          history: [{ date: "2026-01-15", action: "Introduced", importance: 1 }],
          session: {},
        },
      })));
    vi.stubGlobal("fetch", mockFetch);

    const result = await searchBill("test-api-key", "AZ", "HB 2991");
    expect(result).not.toBeNull();
    expect(result!.legiscan_bill_id).toBe(12345);
    expect(result!.status_simple).toBe("Introduced");

    vi.unstubAllGlobals();
  });
});
