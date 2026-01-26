import { parse } from "date-fns";

import type { IBuildClicksByTimeQueryResult } from "./schemas";

export async function buildClicksByTimeQuery(db: D1Database, days: number = 30, userId: string): Promise<IBuildClicksByTimeQueryResult[]> {
    const query = `
        SELECT
            substr(sl_link_request.timestamp, 1, 10) as date,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.short_id = sl_user_links.short_id
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= datetime('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await db.prepare(query).bind(userId, days).all<{ date: string; clicks: number }>();

    return result.results.map(row => ({
        date: parse(row.date, "yyyy-MM-dd", new Date()),
        clicks: row.clicks,
        userId,
    }));
}
