import { env } from "cloudflare:test";

export async function setupTestDb() {
  const db = env.DB;

  await db.prepare(`CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY AUTOINCREMENT, state TEXT NOT NULL, bill_number TEXT NOT NULL, title TEXT, legiscan_bill_id INTEGER, legiscan_url TEXT, status_simple TEXT NOT NULL DEFAULT 'Introduced', status_detail TEXT, date_introduced TEXT, last_action_date TEXT, last_action_description TEXT, session_end_date TEXT, social_media_definition TEXT, notes TEXT, change_hash TEXT, legiscan_session_id INTEGER, urgent INTEGER NOT NULL DEFAULT 0, enforcement_status TEXT, lawsuit_citation TEXT, recap_docket_url TEXT, ai_notes TEXT, ai_social_media_definition TEXT, status_override TEXT, title_override TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(state, bill_number))`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0)`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS bill_categories (bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE, category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE, reason TEXT, PRIMARY KEY (bill_id, category_id))`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS sync_log (id INTEGER PRIMARY KEY AUTOINCREMENT, bill_id INTEGER NOT NULL REFERENCES bills(id), trigger_type TEXT NOT NULL, outcome TEXT NOT NULL, old_hash TEXT, new_hash TEXT, changes TEXT, error_message TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`).run();

  await db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, email TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', created_at TEXT NOT NULL DEFAULT (datetime('now')))`).run();

  // Clear data between test runs
  await db.prepare(`DELETE FROM sync_log`).run();
  await db.prepare(`DELETE FROM bill_categories`).run();
  await db.prepare(`DELETE FROM bills`).run();
  await db.prepare(`DELETE FROM categories`).run();
  await db.prepare(`DELETE FROM users`).run();

  await db.prepare(`INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('Age Verification', 1)`).run();
  await db.prepare(`INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('Parental Consent', 2)`).run();
  await db.prepare(`INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('Minimum Age Ban', 3)`).run();

  return db;
}
