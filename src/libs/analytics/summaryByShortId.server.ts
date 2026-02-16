import { env } from "cloudflare:workers";

import type { IBuildSummaryByShortIdQueryResult } from "./schemas";

export async function buildSummaryByShortIdQuery(id: number, userId: string): Promise<IBuildSummaryByShortIdQueryResult> {
    const totalClicksQuery = `
        SELECT COUNT(*) as totalClicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
    `;

    const uniqueVisitorsQuery = `
        SELECT COUNT(DISTINCT sl_link_request.ip_address) as uniqueVisitors
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
    `;

    const last7DaysClicksQuery = `
        SELECT COUNT(*) as last7DaysClicks
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= datetime('now', '-7 days')
    `;

    const firstRequestQuery = `
        SELECT MIN(sl_link_request.timestamp) as firstRequest
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.link_map_id
        WHERE sl_user_links.link_map_id = ?
        AND sl_user_links.user_id = ?
    `;

    const [totalClicksResult, uniqueVisitorsResult, last7DaysClicksResult, firstRequestResult] = await env.DB.batch([
        env.DB.prepare(totalClicksQuery).bind(id, userId),
        env.DB.prepare(uniqueVisitorsQuery).bind(id, userId),
        env.DB.prepare(last7DaysClicksQuery).bind(id, userId),
        env.DB.prepare(firstRequestQuery).bind(id, userId),
    ]) as [
        D1Result<{ totalClicks: number }>,
        D1Result<{ uniqueVisitors: number }>,
        D1Result<{ last7DaysClicks: number }>,
        D1Result<{ firstRequest: string | null }>,
    ];

    return {
        id,
        totalClicks: totalClicksResult.results[0]?.totalClicks || 0,
        uniqueVisitors: uniqueVisitorsResult.results[0]?.uniqueVisitors || 0,
        last7DaysClicks: last7DaysClicksResult.results[0]?.last7DaysClicks || 0,
        firstRequest: firstRequestResult.results[0]?.firstRequest || null,
    };
}
