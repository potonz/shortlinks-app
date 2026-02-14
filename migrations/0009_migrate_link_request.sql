-- Migration number: 0009 	 2026-02-12

-- Add link_map_id column
ALTER TABLE sl_link_request ADD COLUMN link_map_id INTEGER;

-- Update existing rows: populate link_map_id from sl_links_map
UPDATE sl_link_request
SET link_map_id = (
    SELECT sl_links_map.id
    FROM sl_links_map
    WHERE sl_links_map.short_id = sl_link_request.short_id
);

-- Drop old index first (must be done before dropping the column it references)
DROP INDEX IF EXISTS idx_sl_link_request_short_id;

-- Drop old short_id column
ALTER TABLE sl_link_request DROP COLUMN short_id;

-- Create index on link_map_id
CREATE INDEX IF NOT EXISTS idx_sl_link_request_link_map_id ON sl_link_request(link_map_id);

PRAGMA optimize;
