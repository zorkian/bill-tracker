import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { createBill, getBillById, getAllBillsWithCategories, updateBill, deleteBill } from "../../src/services/bills";

describe("bills service", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("creates a bill and returns it with id", async () => {
    const bill = await createBill(env.DB, {
      state: "AZ",
      bill_number: "HB 2991",
      title: "Social media age verification",
      status_simple: "Introduced",
      category_ids: [1, 2],
    });
    expect(bill.id).toBeDefined();
    expect(bill.state).toBe("AZ");
    expect(bill.bill_number).toBe("HB 2991");
  });

  it("gets a bill by id with categories", async () => {
    const created = await createBill(env.DB, {
      state: "CA",
      bill_number: "AB 1709",
      title: "Minimum age for social media",
      status_simple: "Introduced",
      category_ids: [1, 3],
    });
    const bill = await getBillById(env.DB, created.id);
    expect(bill).not.toBeNull();
    expect(bill!.categories).toHaveLength(2);
    expect(bill!.categories.map((c) => c.name)).toContain("Age Verification");
    expect(bill!.categories.map((c) => c.name)).toContain("Minimum Age Ban");
  });

  it("gets all bills with categories", async () => {
    await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [1] });
    await createBill(env.DB, { state: "CA", bill_number: "AB 1709", status_simple: "Introduced", category_ids: [2] });
    const bills = await getAllBillsWithCategories(env.DB);
    expect(bills).toHaveLength(2);
    expect(bills[0].categories.length).toBeGreaterThanOrEqual(1);
  });

  it("updates a bill", async () => {
    const bill = await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await updateBill(env.DB, bill.id, { status_simple: "Passed One Chamber", notes: "Passed the House", category_ids: [1, 2] });
    const updated = await getBillById(env.DB, bill.id);
    expect(updated!.status_simple).toBe("Passed One Chamber");
    expect(updated!.notes).toBe("Passed the House");
    expect(updated!.categories).toHaveLength(2);
  });

  it("deletes a bill", async () => {
    const bill = await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await deleteBill(env.DB, bill.id);
    const deleted = await getBillById(env.DB, bill.id);
    expect(deleted).toBeNull();
  });

  it("enforces unique state+bill_number", async () => {
    await createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] });
    await expect(
      createBill(env.DB, { state: "AZ", bill_number: "HB 2991", status_simple: "Introduced", category_ids: [] })
    ).rejects.toThrow();
  });
});
