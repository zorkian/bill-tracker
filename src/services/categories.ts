import type { Category } from "../types";

export async function getAllCategories(db: D1Database): Promise<Category[]> {
  const result = await db.prepare("SELECT * FROM categories ORDER BY sort_order").all<Category>();
  return result.results;
}
