-- Migration number: 0007 	 2026-02-05T00:00:00.000Z

CREATE TABLE IF NOT EXISTS sl_base_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    base_url VARCHAR(255) NOT NULL UNIQUE,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sl_links_map_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_id VARCHAR(255) NOT NULL,
    target_url VARCHAR(65535) NOT NULL,
    base_url_id INTEGER,
    last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (short_id, base_url_id)
);

INSERT INTO sl_links_map_new (short_id, target_url, last_accessed_at, created_at)
SELECT short_id, target_url, last_accessed_at, created_at FROM sl_links_map;

DROP TABLE sl_links_map;

ALTER TABLE sl_links_map_new RENAME TO sl_links_map;

CREATE INDEX IF NOT EXISTS idx_sl_links_map_last_accessed_at ON sl_links_map(last_accessed_at);
CREATE INDEX IF NOT EXISTS idx_sl_links_map_base_url_id ON sl_links_map(base_url_id);
CREATE INDEX IF NOT EXISTS idx_sl_links_map_short_id_base_url ON sl_links_map(short_id, base_url_id);

PRAGMA optimize;
