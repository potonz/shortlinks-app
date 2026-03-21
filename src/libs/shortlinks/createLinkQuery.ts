import { env } from "cloudflare:workers";

import { getShortLinksManager } from "~/libs/shortlinks/manager";

export async function createLinkQuery(
    userId: string,
    targetUrl: string,
    baseUrlId: number | null,
): Promise<{ success: true; shortId: string; linkMapId: number } | { success: false; error: string }> {
    const manager = await getShortLinksManager();
    const shortId = await manager.createShortLink(targetUrl, baseUrlId);

    const linkMapResult = await env.DB.prepare(
        `SELECT id FROM sl_links_map WHERE short_id = ? AND (base_url_id = ? OR (base_url_id IS NULL AND ? IS NULL))`,
    ).bind(shortId, baseUrlId, baseUrlId).first<{ id: number }>();

    if (!linkMapResult) {
        return { success: false, error: "Failed to retrieve created link" };
    }

    const insertResult = await env.DB.prepare(
        `INSERT INTO sl_user_links (link_map_id, user_id) VALUES (?, ?)`,
    ).bind(linkMapResult.id, userId).run();

    if (!insertResult.success) {
        return { success: false, error: "Failed to associate link with user" };
    }

    return { success: true, shortId, linkMapId: linkMapResult.id };
}
