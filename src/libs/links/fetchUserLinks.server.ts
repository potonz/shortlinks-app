import { env } from "cloudflare:workers";

import type { ILinkTableRow } from "~/types/links";

interface IFetchUserLinksQueryInput {
    page: number;
    limit: number;
}

interface IFetchUserLinksQueryResult {
    success: boolean;
    data?: ILinkTableRow[];
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

    const countResult = await env.DB!.prepare(countQuery)
        .bind(userId)
        .first<{ total: number }>();

    const totalLinks = countResult?.total || 0;

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
        WHERE sl_user_links.user_id = ?
        GROUP BY sl_links_map.short_id
        ORDER BY sl_links_map.created_at DESC
        LIMIT ? OFFSET ?
    `;

    const result = await env.DB!.prepare(query)
        .bind(userId, input.limit, offset)
        .all<{
        short_id: string;
        target_url: string;
        last_accessed_at: string;
        created_at: string;
        total_clicks: number;
    }>();

    const baseUrl = import.meta.env.VITE_SHORT_LINK_BASE_URL || "";

    const links: ILinkTableRow[] = result.results.map(row => ({
        shortId: row.short_id,
        originalUrl: row.target_url,
        shortUrl: `${baseUrl}/${row.short_id}`,
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
