CREATE TABLE IF NOT EXISTS `apikey` (
    `id` TEXT NOT NULL PRIMARY KEY,
    `name` TEXT,
    `start` TEXT,
    `prefix` TEXT,
    `key` TEXT NOT NULL UNIQUE,
    `userId` TEXT NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
    `refillInterval` INTEGER,
    `refillAmount` INTEGER,
    `lastRefillAt` TEXT,
    `enabled` INTEGER NOT NULL DEFAULT 1,
    `rateLimitEnabled` INTEGER NOT NULL DEFAULT 0,
    `rateLimitTimeWindow` INTEGER,
    `rateLimitMax` INTEGER,
    `requestCount` INTEGER NOT NULL DEFAULT 0,
    `remaining` INTEGER,
    `lastRequest` TEXT,
    `expiresAt` TEXT,
    `createdAt` TEXT NOT NULL,
    `updatedAt` TEXT NOT NULL,
    `permissions` TEXT,
    `metadata` TEXT
);

CREATE INDEX IF NOT EXISTS `apikey_userId_idx` ON `apikey`(`userId`);
