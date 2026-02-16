import { env } from "cloudflare:workers";

export async function buildReferrersQuery(limit: number = 10, userId: string) {
    const query = `
        SELECT
            substr(sl_link_request.referer, instr(sl_link_request.referer, '://') + 3) as referrer,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.referer IS NOT NULL AND sl_link_request.referer != ''
        GROUP BY sl_link_request.referer
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB.prepare(query).bind(userId, limit).all<{ referrer: string; clicks: number }>();

    return result.results.map(row => ({
        referrer: row.referrer,
        clicks: row.clicks,
        userId,
    }));
}
