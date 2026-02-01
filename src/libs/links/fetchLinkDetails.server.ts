import { env } from "cloudflare:workers";

import type { ILink } from "~/types/links";

export async function fetchLinkDetailsQuery(shortId: string, userId: string): Promise<{
    success: boolean;
    data?: ILink;
    error?: string;
}> {
    const query = `
        SELECT 
            sl_links_map.short_id,
            sl_links_map.target_url,
            sl_links_map.last_accessed_at,
            sl_links_map.created_at,
            COUNT(sl_link_request.id) as total_clicks
        FROM sl_user_links
        INNER JOIN sl_links_map ON sl_user_links.short_id = sl_links_map.short_id
        LEFT JOIN sl_link_request ON sl_links_map.short_id = sl_link_request.short_id
        WHERE sl_user_links.short_id = ? AND sl_user_links.user_id = ?
        GROUP BY sl_links_map.short_id
    `;

    const result = await env.DB.prepare(query).bind(shortId, userId).first<{
        short_id: string;
        target_url: string;
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

    const link: ILink = {
        shortId: result.short_id,
        originalUrl: result.target_url,
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
