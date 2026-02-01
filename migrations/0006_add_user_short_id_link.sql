-- Migration number: 0006 	 2026-01-26T09:22:42.721Z

CREATE TABLE IF NOT EXISTS sl_user_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_id TEXT NOT NULL,
    user_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (short_id) REFERENCES sl_links_map(short_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sl_user_links_user_id ON sl_user_links(user_id);
CREATE INDEX IF NOT EXISTS idx_sl_user_links_short_id ON sl_user_links(short_id);

PRAGMA optimize;
