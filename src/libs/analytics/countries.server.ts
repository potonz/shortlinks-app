import { env } from "cloudflare:workers";

export async function buildCountriesQuery(limit: number = 10, userId: string) {
    const query = `
        SELECT
            sl_link_request.country,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.short_id = sl_user_links.short_id
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.country IS NOT NULL AND sl_link_request.country != ''
        GROUP BY sl_link_request.country
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB!.prepare(query).bind(userId, limit).all<{ country: string; clicks: number }>();

    return result.results.map(row => ({
        country: row.country,
        clicks: row.clicks,
        userId,
    }));
}
