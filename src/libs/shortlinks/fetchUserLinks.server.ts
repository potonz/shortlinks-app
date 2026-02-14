import { env } from "cloudflare:workers";

import type { ILink } from "~/types/links";

interface IFetchUserLinksQueryInput {
    page: number;
    limit: number;
}

interface IFetchUserLinksQueryResult {
    success: boolean;
    data?: ILink[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export async function fetchUserLinksQuery(
    input: IFetchUserLinksQueryInput,
    userId: string,
): Promise<IFetchUserLinksQueryResult> {
    const offset = (input.page - 1) * input.limit;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM sl_user_links
        WHERE sl_user_links.user_id = ?
    `;

    const countResult = await env.DB.prepare(countQuery)
        .bind(userId)
        .first<{ total: number }>();

    const totalLinks = countResult?.total || 0;

    const query = `
        SELECT
            sl_user_links.link_map_id as id,
            sl_links_map.short_id,
            sl_links_map.target_url,
            sl_links_map.base_url_id,
            sl_links_map.last_accessed_at,
            sl_links_map.created_at,
            COUNT(sl_link_request.id) as total_clicks
        FROM sl_user_links
        INNER JOIN sl_links_map ON sl_user_links.link_map_id = sl_links_map.id
        LEFT JOIN sl_link_request ON sl_links_map.id = sl_link_request.link_map_id
        WHERE sl_user_links.user_id = ?
        GROUP BY sl_links_map.short_id
        ORDER BY sl_links_map.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const result = await env.DB.prepare(query)
        .bind(userId, input.limit, offset)
        .all<{
        id: number;
        short_id: string;
        target_url: string;
        base_url_id: number | null;
        last_accessed_at: string;
        created_at: string;
        total_clicks: number;
    }>();

    const links: ILink[] = result.results.map(row => ({
        id: row.id,
        shortId: row.short_id,
        originalUrl: row.target_url,
        baseUrlId: row.base_url_id,
        totalClicks: row.total_clicks || 0,
        createdAt: row.created_at,
        lastAccessedAt: row.last_accessed_at,
        isActive: true,
    }));

    return {
        success: true,
        data: links,
        pagination: {
            page: input.page,
            limit: input.limit,
            total: totalLinks,
            totalPages: Math.ceil(totalLinks / input.limit),
        },
    };
}
