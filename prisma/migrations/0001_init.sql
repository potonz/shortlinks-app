-- CreateTable
CREATE TABLE "sl_link_request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link_map_id" INTEGER,
    "ip_address" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "timezone" TEXT,
    "asn" INTEGER,
    "as_organization" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sl_link_request_link_map_id_fkey" FOREIGN KEY ("link_map_id") REFERENCES "sl_links_map" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sl_user_ga4_config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measurement_id" TEXT NOT NULL,
    "api_secret_encrypted" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sl_user_ga4_config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "apikey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT,
    "start" TEXT,
    "referenceId" TEXT NOT NULL,
    "prefix" TEXT,
    "key" TEXT NOT NULL,
    "refillInterval" INTEGER,
    "refillAmount" INTEGER,
    "lastRefillAt" DATETIME,
    "enabled" BOOLEAN DEFAULT true,
    "rateLimitEnabled" BOOLEAN DEFAULT true,
    "rateLimitTimeWindow" INTEGER DEFAULT 86400000,
    "rateLimitMax" INTEGER DEFAULT 10,
    "requestCount" INTEGER DEFAULT 0,
    "remaining" INTEGER,
    "lastRequest" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "permissions" TEXT,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "sl_links_map" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "short_id" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "base_url_id" INTEGER,
    "last_accessed_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sl_links_map_base_url_id_fkey" FOREIGN KEY ("base_url_id") REFERENCES "sl_base_urls" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sl_base_urls" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "base_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sl_user_links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link_map_id" INTEGER,
    "user_id" TEXT,
    "ga4_config_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sl_user_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sl_user_links_link_map_id_fkey" FOREIGN KEY ("link_map_id") REFERENCES "sl_links_map" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "sl_user_links_ga4_config_id_fkey" FOREIGN KEY ("ga4_config_id") REFERENCES "sl_user_ga4_config" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "sl_link_request_link_map_id_idx" ON "sl_link_request"("link_map_id");

-- CreateIndex
CREATE INDEX "sl_link_request_timestamp_idx" ON "sl_link_request"("timestamp");

-- CreateIndex
CREATE INDEX "sl_link_request_link_map_id_timestamp_idx" ON "sl_link_request"("link_map_id", "timestamp");

-- CreateIndex
CREATE INDEX "sl_user_ga4_config_user_id_idx" ON "sl_user_ga4_config"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "apikey_configId_idx" ON "apikey"("configId");

-- CreateIndex
CREATE INDEX "apikey_referenceId_idx" ON "apikey"("referenceId");

-- CreateIndex
CREATE INDEX "apikey_key_idx" ON "apikey"("key");

-- CreateIndex
CREATE INDEX "sl_links_map_last_accessed_at_idx" ON "sl_links_map"("last_accessed_at");

-- CreateIndex
CREATE INDEX "sl_links_map_base_url_id_idx" ON "sl_links_map"("base_url_id");

-- CreateIndex
CREATE INDEX "sl_links_map_short_id_base_url_id_idx" ON "sl_links_map"("short_id", "base_url_id");

-- CreateIndex
CREATE UNIQUE INDEX "sl_links_map_short_id_base_url_id_key" ON "sl_links_map"("short_id", "base_url_id");

-- CreateIndex
CREATE UNIQUE INDEX "sl_base_urls_base_url_key" ON "sl_base_urls"("base_url");

-- CreateIndex
CREATE INDEX "sl_user_links_user_id_idx" ON "sl_user_links"("user_id");

-- CreateIndex
CREATE INDEX "sl_user_links_link_map_id_idx" ON "sl_user_links"("link_map_id");

-- CreateIndex
CREATE INDEX "sl_user_links_user_id_link_map_id_idx" ON "sl_user_links"("user_id", "link_map_id");

