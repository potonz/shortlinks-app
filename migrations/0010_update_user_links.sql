-- Migration number: 0010 	 2026-02-12

-- Create new table without short_id and with link_map_id
CREATE TABLE IF NOT EXISTS sl_user_links_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_map_id INTEGER,
    user_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Populate new table with link_map_id from sl_links_map
INSERT INTO sl_user_links_new (id, link_map_id, user_id, created_at)
SELECT 
    ul.id,
    lm.id,
    ul.user_id,
    ul.created_at
FROM sl_user_links ul
INNER JOIN sl_links_map lm ON ul.short_id = lm.short_id;

-- Drop old table
DROP TABLE sl_user_links;

-- Rename new table
ALTER TABLE sl_user_links_new RENAME TO sl_user_links;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sl_user_links_user_id ON sl_user_links(user_id);
CREATE INDEX IF NOT EXISTS idx_sl_user_links_link_map_id ON sl_user_links(link_map_id);

PRAGMA optimize;
