CREATE TABLE IF NOT EXISTS bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  title TEXT,
  legiscan_bill_id INTEGER,
  legiscan_url TEXT,
  status_simple TEXT NOT NULL DEFAULT 'Introduced',
  status_detail TEXT,
  date_introduced TEXT,
  last_action_date TEXT,
  last_action_description TEXT,
  session_end_date TEXT,
  social_media_definition TEXT,
  notes TEXT,
  change_hash TEXT,
  legiscan_session_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(state, bill_number)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bill_categories (
  bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (bill_id, category_id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
