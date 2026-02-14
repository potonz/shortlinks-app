import { env } from "cloudflare:workers";

import type { IBrowsersQueryResult } from "./schemas";

export async function buildBrowsersByShortIdQuery(id: number, limit: number = 10, userId: string): Promise<IBrowsersQueryResult[]> {
    const query = `
        SELECT
            CASE
                WHEN instr(lower(user_agent), 'chrome') > 0 AND instr(lower(user_agent), 'edge') = 0 AND instr(lower(user_agent), 'opr') = 0 THEN 'Chrome'
                WHEN instr(lower(user_agent), 'firefox') > 0 THEN 'Firefox'
                WHEN instr(lower(user_agent), 'safari') > 0 AND instr(lower(user_agent), 'chrome') = 0 THEN 'Safari'
                WHEN instr(lower(user_agent), 'edge') > 0 OR instr(lower(user_agent), 'edg/') > 0 THEN 'Edge'
                ELSE 'Other'
            END as browser,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.id = ?
        AND sl_user_links.user_id = ?
        GROUP BY browser
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await env.DB.prepare(query).bind(id, userId, limit).all<{ browser: string; clicks: number }>();

    return result.results.map(row => ({
        browser: row.browser,
        clicks: row.clicks,
        id,
    }));
}
