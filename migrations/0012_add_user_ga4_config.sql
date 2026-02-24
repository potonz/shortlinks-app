CREATE TABLE IF NOT EXISTS sl_user_ga4_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    measurement_id VARCHAR(50) NOT NULL,
    api_secret_encrypted VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX idx_sl_user_ga4_config_user_id ON sl_user_ga4_config(user_id);

ALTER TABLE sl_user_links ADD COLUMN ga4_config_id INTEGER REFERENCES sl_user_ga4_config(id) ON DELETE SET NULL;
