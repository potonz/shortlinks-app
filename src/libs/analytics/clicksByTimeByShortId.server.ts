import { env } from "cloudflare:workers";
import { parse } from "date-fns";

import type { IBuildClicksByTimeQueryResult } from "./schemas";

export async function buildClicksByTimeByShortIdQuery(id: number, days: number = 30, userId: string): Promise<IBuildClicksByTimeQueryResult[]> {
    const query = `
        SELECT
            substr(sl_link_request.timestamp, 1, 10) as date,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.id = ?
        AND sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= datetime('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await env.DB.prepare(query).bind(id, userId, days).all<{ date: string; clicks: number }>();

    return result.results.map(row => ({
        date: parse(row.date, "yyyy-MM-dd", new Date()),
        clicks: row.clicks,
        id,
    }));
}
