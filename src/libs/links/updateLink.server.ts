import { env } from "cloudflare:workers";

import type { IUpdateLinkResult } from "~/types/links";

interface IUpdateLinkData {
    shortId: string;
    data: {
        originalUrl?: string;
        expiresAt?: string | null;
        isActive?: boolean;
    };
}

export async function updateLinkQuery(input: IUpdateLinkData, userId: string): Promise<IUpdateLinkResult> {
    if (input.data.originalUrl) {
        const result = await env.DB.prepare(`
            UPDATE sl_links_map 
            SET target_url = ?
            WHERE short_id = ?
                AND EXISTS (
                    SELECT 1 FROM sl_user_links 
                    WHERE short_id = ? AND user_id = ?
                )
        `).bind(input.data.originalUrl, input.shortId, input.shortId, userId).run();

        if (!result.success || result.meta?.changes === 0) {
            return {
                success: false,
                error: "Link not found or access denied",
            };
        }
    }

    return {
        success: true,
    };
}
