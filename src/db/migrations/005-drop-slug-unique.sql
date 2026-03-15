-- SQLite can't drop constraints directly, so recreate the table.
-- Preserve all existing data.
CREATE TABLE categories_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
INSERT INTO categories_new (id, name, slug, sort_order) SELECT id, name, slug, sort_order FROM categories;
DROP TABLE categories;
ALTER TABLE categories_new RENAME TO categories;
