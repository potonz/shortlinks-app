import { env } from "cloudflare:workers";

import { encrypt } from "../crypto/encryption";
import type { TGA4Config } from "./types";

interface ISaveGa4ConfigInput {
    name: string;
    measurementId: string;
    apiSecret: string;
    enabled?: boolean;
}

interface ISaveGa4ConfigResult {
    success: boolean;
    data?: TGA4Config;
    error?: string;
}

const STMT_CHECK_EXISTS = env.DB.prepare(`
    SELECT id FROM sl_user_ga4_config
    WHERE user_id = ? AND name = ?
`);

const STMT_INSERT = env.DB.prepare(`
    INSERT INTO sl_user_ga4_config (user_id, name, measurement_id, api_secret_encrypted, enabled)
    VALUES (?, ?, ?, ?, ?)
`);

const STMT_UPDATE = env.DB.prepare(`
    UPDATE sl_user_ga4_config
    SET measurement_id = ?, api_secret_encrypted = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
`);

const STMT_GET_CONFIG = env.DB.prepare(`
    SELECT * FROM sl_user_ga4_config WHERE user_id = ? AND name = ?
`);

export async function saveGa4Config(
    input: ISaveGa4ConfigInput,
    userId: string,
): Promise<ISaveGa4ConfigResult> {
    const { name, measurementId, apiSecret, enabled = true } = input;

    if (!name || !measurementId || !apiSecret) {
        return { success: false, error: "Missing required fields" };
    }

    if (!/^G-[A-Z0-9]{8,10}$/i.test(measurementId)) {
        return { success: false, error: "Invalid Measurement ID format (expected G-XXXXXXXXXX)" };
    }

    try {
        const apiSecretEncrypted = await encrypt(apiSecret);

        const existingConfig = await STMT_CHECK_EXISTS
            .bind(userId, name)
            .first<{ id: number }>();

        const batchStmts: ReturnType<typeof env.DB.prepare>[] = [];

        if (existingConfig) {
            batchStmts.push(STMT_UPDATE.bind(measurementId, apiSecretEncrypted, enabled, existingConfig.id));
        }
        else {
            batchStmts.push(STMT_INSERT.bind(userId, name, measurementId, apiSecretEncrypted, enabled));
        }

        batchStmts.push(STMT_GET_CONFIG.bind(userId, name));

        const [, getResult] = await env.DB.batch(batchStmts);
        const config = getResult?.results[0] as TGA4Config | undefined;

        return { success: true, data: config };
    }
    catch (error) {
        console.error("Error saving GA4 config:", error);
        return { success: false, error: "Failed to save GA4 config" };
    }
}
