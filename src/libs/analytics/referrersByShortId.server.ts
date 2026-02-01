import { env } from "cloudflare:workers";

import type { IBuildReferrersQueryResult } from "./schemas";

export async function buildReferrersByShortIdQuery(shortId: string, limit: number = 10, userId: string): Promise<IBuildReferrersQueryResult[]> {
    const query = `
        SELECT
            CASE
                WHEN referer IS NULL OR referer = '' THEN 'Direct'
                WHEN instr(referer, '://') = 0 THEN referer
                ELSE substr(referer, instr(referer, '://') + 3)
            END as referrer,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.short_id = sl_user_links.short_id
        WHERE sl_link_request.short_id = ?
        AND sl_user_links.user_id = ?
        GROUP BY referrer
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB.prepare(query).bind(shortId, userId, limit).all<{ referrer: string; clicks: number }>();

    return result.results.map(row => ({
        referrer: row.referrer,
        clicks: row.clicks,
        shortId,
    }));
}
