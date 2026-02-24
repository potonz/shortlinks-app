import { env } from "cloudflare:workers";

import type { TGA4Config } from "./types";

interface IGetUserGa4ConfigsResult {
    success: boolean;
    data?: TGA4Config[];
    error?: string;
}

const STMT_GET_CONFIGS = env.DB.prepare(`
    SELECT * FROM sl_user_ga4_config
    WHERE user_id = ?
    ORDER BY name ASC
`);

export async function getUserGa4Configs(userId: string): Promise<IGetUserGa4ConfigsResult> {
    try {
        const configs = await STMT_GET_CONFIGS.bind(userId).all<TGA4Config>();

        return { success: true, data: configs.results };
    }
    catch (error) {
        console.error("Error fetching GA4 configs:", error);
        return { success: false, error: "Failed to fetch GA4 configs" };
    }
}
