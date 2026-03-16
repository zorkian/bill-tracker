CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_id INTEGER NOT NULL REFERENCES bills(id),
  trigger_type TEXT NOT NULL,
  outcome TEXT NOT NULL,
  old_hash TEXT,
  new_hash TEXT,
  changes TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sync_log_bill_id ON sync_log(bill_id);
