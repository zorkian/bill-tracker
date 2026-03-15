import type { Category } from "../types";

export async function getAllCategories(db: D1Database): Promise<Category[]> {
  const result = await db.prepare("SELECT * FROM categories ORDER BY name").all<Category>();
  return result.results;
}

export async function createCategory(db: D1Database, name: string): Promise<Category> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const maxOrder = await db.prepare("SELECT MAX(sort_order) as m FROM categories").first<{ m: number | null }>();
  const sortOrder = (maxOrder?.m ?? 0) + 1;
  await db.prepare("INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)")
    .bind(name, slug, sortOrder).run();
  const cat = await db.prepare("SELECT * FROM categories WHERE slug = ?").bind(slug).first<Category>();
  return cat!;
}

export async function updateCategory(db: D1Database, id: number, name: string): Promise<void> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await db.prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?")
    .bind(name, slug, id).run();
}

export async function deleteCategory(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM bill_categories WHERE category_id = ?").bind(id).run();
  await db.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
}
