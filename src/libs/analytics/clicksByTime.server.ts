import { env } from "cloudflare:workers";
import { format, isValid, parse, subDays } from "date-fns";

import type { IBuildClicksByTimeQueryResult } from "./schemas";

export async function buildClicksByTimeQuery(
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
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= ?
        AND sl_link_request.timestamp <= ?
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await env.DB.prepare(query).bind(userId, startDateStr, endDateStr).all<{ date: string; clicks: number }>();

    return result.results.map(row => ({
        date: parse(row.date, "yyyy-MM-dd", new Date()),
        clicks: row.clicks,
        userId,
    }));
}

export async function buildClicksByTimeWithTrendQuery(
    days: number = 30,
    userId: string,
    startDate?: Date,
    endDate?: Date,
): Promise<{ data: IBuildClicksByTimeQueryResult[]; totalChange: number; trendIndicator: string }> {
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
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= ?
        AND sl_link_request.timestamp <= ?
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await env.DB.prepare(query).bind(userId, startDateStr, endDateStr).all<{ date: string; clicks: number }>();

    const data = result.results.map(row => ({
        date: parse(row.date, "yyyy-MM-dd", new Date()),
        clicks: row.clicks,
        userId,
    }));

    if (data.length < 2) {
        return {
            data,
            totalChange: 0,
            trendIndicator: data.length === 1 && data[0].clicks > 0 ? "up" : "neutral",
        };
    }

    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const previousTotalClicks = data.slice(0, data.length - 1).reduce((sum, item) => sum + item.clicks, 0);

    const totalChange = previousTotalClicks > 0 ? ((totalClicks - previousTotalClicks) / previousTotalClicks) * 100 : 0;
    const trendIndicator = totalChange > 0 ? "up" : totalChange < 0 ? "down" : "neutral";

    return {
        data,
        totalChange,
        trendIndicator,
    };
}
