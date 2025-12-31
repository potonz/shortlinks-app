-- Migration number: 0002 	 2025-12-31T18:50:28.202Z

CREATE TABLE IF NOT EXISTS sl_link_request (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_id TEXT NOT NULL,
  ip_address TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude REAL,
  longitude REAL,
  timezone TEXT,
  asn INTEGER,
  as_organization TEXT,
  user_agent TEXT,
  referer TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
