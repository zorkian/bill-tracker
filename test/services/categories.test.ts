import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { setupTestDb } from "../helpers/setup";
import { getAllCategories } from "../../src/services/categories";

describe("categories service", () => {
  beforeEach(async () => {
    await setupTestDb();
  });

  it("returns all categories sorted by sort_order", async () => {
    const categories = await getAllCategories(env.DB);
    expect(categories.length).toBeGreaterThanOrEqual(3);
    expect(categories[0].sort_order).toBeLessThanOrEqual(categories[1].sort_order);
  });
});
