import { env } from "cloudflare:workers";

import type { IBuildReferrersQueryResult } from "./schemas";

export async function buildReferrersByShortIdQuery(id: number, limit: number = 10, userId: string): Promise<IBuildReferrersQueryResult[]> {
    const query = `
        SELECT
            CASE
                WHEN referer IS NULL OR referer = '' THEN 'Direct'
                WHEN instr(referer, '://') = 0 THEN referer
                ELSE substr(referer, instr(referer, '://') + 3)
            END as referrer,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
        GROUP BY referrer
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB.prepare(query).bind(id, userId, limit).all<{ referrer: string; clicks: number }>();

    return result.results.map(row => ({
        referrer: row.referrer,
        clicks: row.clicks,
        id,
    }));
}
