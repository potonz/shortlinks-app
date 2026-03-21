import { env } from "cloudflare:workers";

import type { ILink } from "~/types/links";

export async function fetchLinkDetailsQuery(id: number, userId: string): Promise<{
    success: boolean;
    data?: ILink;
    error?: string;
}> {
    const query = `
        SELECT
            sl_user_links.link_map_id as id,
            sl_links_map.short_id,
            sl_links_map.target_url,
            sl_links_map.base_url_id,
            sl_base_urls.base_url,
            sl_links_map.last_accessed_at,
            sl_links_map.created_at,
            COUNT(sl_link_request.id) as total_clicks
        FROM sl_user_links
        INNER JOIN sl_links_map ON sl_user_links.link_map_id = sl_links_map.id
        LEFT JOIN sl_base_urls ON sl_links_map.base_url_id = sl_base_urls.id
        LEFT JOIN sl_link_request ON sl_links_map.id = sl_link_request.link_map_id
        WHERE sl_user_links.link_map_id = ? AND sl_user_links.user_id = ?
        GROUP BY sl_links_map.short_id
    `;

    const result = await env.DB.prepare(query).bind(id, userId).first<{
        id: number;
        short_id: string;
        target_url: string;
        base_url_id: number | null;
        base_url: string | null;
        last_accessed_at: string;
        created_at: string;
        total_clicks: number;
    }>();

    if (!result) {
        return {
            success: false,
            error: "Link not found",
        };
    }

    let fullShortLink = null;
    if (result.base_url) {
        try {
            fullShortLink = new URL(result.short_id, result.base_url).href;
        }
        catch { /* do nothing */ }
    }

    const link: ILink = {
        id: result.id,
        shortId: result.short_id,
        baseUrlId: result.base_url_id,
        baseUrl: result.base_url,
        fullShortLink,
        targetUrl: result.target_url,
        totalClicks: result.total_clicks || 0,
        createdAt: result.created_at,
        lastAccessedAt: result.last_accessed_at,
        isActive: true,
    };

    return {
        success: true,
        data: link,
    };
}
