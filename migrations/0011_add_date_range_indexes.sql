-- Migration number: 0011 	 2026-02-16

-- Create index on timestamp for date range filtering performance
CREATE INDEX IF NOT EXISTS idx_sl_link_request_timestamp ON sl_link_request(timestamp);

-- Create composite index on link_map_id and timestamp for efficient user link analytics queries
CREATE INDEX IF NOT EXISTS idx_sl_link_request_link_map_id_timestamp ON sl_link_request(link_map_id, timestamp);

-- Create composite index on user_id and link_map_id for efficient user link analytics queries
CREATE INDEX IF NOT EXISTS idx_sl_user_links_user_id_link_map_id ON sl_user_links(user_id, link_map_id);

-- Create composite index on user_id and timestamp for efficient user analytics queries with date ranges
CREATE INDEX IF NOT EXISTS idx_sl_user_links_user_id_timestamp ON sl_user_links(user_id, (SELECT timestamp FROM sl_link_request WHERE sl_link_request.link_map_id = sl_user_links.link_map_id ORDER BY sl_link_request.timestamp DESC LIMIT 1));

PRAGMA optimize;
