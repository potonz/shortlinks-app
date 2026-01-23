-- Migration number: 0004 	 2026-01-18T01:42:09.981Z

PRAGMA foreign_keys = ON;

-- =====================
-- User table
-- =====================
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    emailVerified INTEGER NOT NULL DEFAULT 0, -- boolean: 0 = false, 1 = true
    image TEXT,
    createdAt TEXT NOT NULL, -- ISO-8601 datetime string
    updatedAt TEXT NOT NULL
);

-- Optional but common index
CREATE UNIQUE INDEX idx_user_email ON user(email);

-- =====================
-- Session table
-- =====================
CREATE TABLE session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_session_token ON session(token);
CREATE INDEX idx_session_userId ON session(userId);

-- =====================
-- Account table
-- =====================
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE INDEX idx_account_userId ON account(userId);
CREATE INDEX idx_account_provider ON account(providerId, accountId);
