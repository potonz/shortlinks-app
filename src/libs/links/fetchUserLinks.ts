import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import type { IFetchLinksResult, ILinkTableRow } from "~/types/links";

const paginationValidator = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export const fetchUserLinks = createServerFn({ method: "GET" })
    .inputValidator(paginationValidator)
    .handler(async ({ data }): Promise<IFetchLinksResult> => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (!userId) {
                return {
                    success: false,
                    error: "User not authenticated",
                };
            }

            const offset = (data.page - 1) * data.limit;

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
                .bind(userId, data.limit, offset)
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
                    page: data.page,
                    limit: data.limit,
                    total: totalLinks,
                    totalPages: Math.ceil(totalLinks / data.limit),
                },
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching user links:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
