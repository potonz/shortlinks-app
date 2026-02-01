import { env } from "cloudflare:workers";

import { getShortLinksManager } from "~/libs/shortlinks/manager";
import type { IDeleteLinkResult } from "~/types/links";

export async function deleteLinkQuery(shortId: string, userId: string): Promise<IDeleteLinkResult> {
    const deleteUserLinkResult = await env.DB.prepare(`
        DELETE FROM sl_user_links 
        WHERE short_id = ? AND user_id = ?
    `).bind(shortId, userId).run();

    if (!deleteUserLinkResult.success || deleteUserLinkResult.meta?.changes === 0) {
        return {
            success: false,
            error: "Link not found or access denied",
        };
    }

    const manager = await getShortLinksManager();
    await manager.removeShortLink(shortId);

    return {
        success: true,
    };
}
