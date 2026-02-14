import { env } from "cloudflare:workers";

import type { IBuildCountriesQueryResult } from "./schemas";

export async function buildCountriesByShortIdQuery(id: number, limit: number = 10, userId: string): Promise<IBuildCountriesQueryResult[]> {
    const query = `
        SELECT
            sl_link_request.country,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.id = ?
        AND sl_user_links.user_id = ?
        AND sl_link_request.country IS NOT NULL AND sl_link_request.country != ''
        GROUP BY sl_link_request.country
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB.prepare(query).bind(id, userId, limit).all<{ country: string; clicks: number }>();

    return result.results.map(row => ({
        country: row.country,
        clicks: row.clicks,
        id,
    }));
}
