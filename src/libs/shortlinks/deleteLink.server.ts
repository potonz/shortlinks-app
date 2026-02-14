import { env } from "cloudflare:workers";

import { getShortLinksManager } from "~/libs/shortlinks/manager";
import type { IDeleteLinkResult } from "~/types/links";

export async function deleteLinkQuery(id: number, userId: string): Promise<IDeleteLinkResult> {
    const userLinkData = await env.DB.prepare(`
        SELECT ul.id, ul.link_map_id, lm.short_id, lm.base_url_id
        FROM sl_user_links ul
        JOIN sl_links_map lm ON ul.link_map_id = lm.id
        WHERE ul.link_map_id = ? AND ul.user_id = ?
    `).bind(id, userId).first<{ id: number; link_map_id: number; short_id: string; base_url_id: number | null }>();

    if (!userLinkData?.id) {
        return {
            success: false,
            error: "Link not found or access denied",
        };
    }

    const deleteUserLinkResult = await env.DB.prepare(`
        DELETE FROM sl_user_links WHERE id = ?
    `).bind(userLinkData.id).run();

    if (!deleteUserLinkResult.success || deleteUserLinkResult.meta?.changes === 0) {
        return {
            success: false,
            error: "Link not found or access denied",
        };
    }

    const manager = await getShortLinksManager();
    await manager.removeShortLink(userLinkData.short_id, userLinkData.base_url_id);

    return {
        success: true,
    };
}
