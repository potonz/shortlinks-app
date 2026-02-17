import { env } from "cloudflare:workers";
import { format, isValid, parse, subDays } from "date-fns";

import type { IBuildClicksByTimeQueryResult } from "./schemas";

export async function buildClicksByTimeByShortIdQuery(
    id: number,
    days: number = 30,
    userId: string,
    startDate?: Date,
    endDate?: Date,
): Promise<IBuildClicksByTimeQueryResult[]> {
    const now = new Date();
    const endTime = endDate || now;
    const startTime = startDate || subDays(now, days);

    if (!isValid(startTime) || !isValid(endTime)) {
        throw new Error("Invalid date range");
    }

    if (startTime > endTime) {
        throw new Error("Start date cannot be after end date");
    }

    const startDateStr = format(startTime, "yyyy-MM-dd");
    const endDateStr = format(endTime, "yyyy-MM-dd");

    const query = `
        SELECT
            substr(sl_link_request.timestamp, 1, 10) as date,
            COUNT(*) as clicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= ?
        AND sl_link_request.timestamp <= ?
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await env.DB.prepare(query).bind(id, userId, startDateStr, endDateStr).all<{ date: string; clicks: number }>();

    return result.results.map(row => ({
        date: parse(row.date, "yyyy-MM-dd", new Date()),
        clicks: row.clicks,
        id,
    }));
}
