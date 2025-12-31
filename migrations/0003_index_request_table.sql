-- Migration number: 0003 	 2025-12-31T19:04:23.571Z

CREATE INDEX IF NOT EXISTS idx_sl_link_request_short_id ON sl_link_request(short_id);

PRAGMA optimize;
