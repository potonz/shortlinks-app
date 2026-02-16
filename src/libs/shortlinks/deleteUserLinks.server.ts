import { env } from "cloudflare:workers";

import { getShortLinksManager } from "~/libs/shortlinks/manager";

export async function deleteUserLinks(userId: string): Promise<void> {
    const shortLinksResult = await env.DB.prepare(`
        SELECT sl_links_map.short_id, sl_links_map.base_url_id
        FROM sl_user_links
        INNER JOIN sl_links_map ON sl_links_map.id = sl_user_links.link_map_id
        WHERE user_id = ?
    `).bind(userId).all<{ short_id: string; base_url_id: number | null }>();

    if (shortLinksResult.success && shortLinksResult.results.length > 0) {
        const manager = await getShortLinksManager();

        for (const row of shortLinksResult.results) {
            try {
                await manager.removeShortLink(row.short_id, row.base_url_id);
            }
            catch (error) {
                console.error(`Failed to delete short link: ${row.short_id}`, error);
            }
        }
    }

    await env.DB.prepare(`
        DELETE FROM sl_user_links WHERE user_id = ?
    `).bind(userId).run();
}
