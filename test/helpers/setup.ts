import { env } from "cloudflare:test";

export async function setupTestDb() {
  const db = env.DB;

  await db.prepare(`CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY AUTOINCREMENT, state TEXT NOT NULL, bill_number TEXT NOT NULL, title TEXT, legiscan_bill_id INTEGER, legiscan_url TEXT, status_simple TEXT NOT NULL DEFAULT 'Introduced', status_detail TEXT, date_introduced TEXT, last_action_date TEXT, last_action_description TEXT, session_end_date TEXT, social_media_definition TEXT, notes TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(state, bill_number))`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE, sort_order INTEGER NOT NULL DEFAULT 0)`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS bill_categories (bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE, category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE, PRIMARY KEY (bill_id, category_id))`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`).run();

  // Clear data between test runs
  await db.prepare(`DELETE FROM bill_categories`).run();
  await db.prepare(`DELETE FROM bills`).run();
  await db.prepare(`DELETE FROM categories`).run();

  await db.prepare(`INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Age Verification', 'age-verification', 1)`).run();
  await db.prepare(`INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Parental Consent', 'parental-consent', 2)`).run();
  await db.prepare(`INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES ('Minimum Age Ban', 'minimum-age-ban', 3)`).run();

  return db;
}
