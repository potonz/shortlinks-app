import { env } from "cloudflare:workers";

import type { IBuildSummaryQueryResult } from "./schemas";

export async function buildSummaryQuery(userId: string): Promise<IBuildSummaryQueryResult> {
    const totalLinksQuery = `
        SELECT COUNT(*) as count
        FROM sl_user_links
        WHERE user_id = ?
    `;

    const totalClicksQuery = `
        SELECT COUNT(*) as count
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.user_id = ?
    `;

    const uniqueVisitorsQuery = `
        SELECT COUNT(DISTINCT sl_link_request.ip_address) as count
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.user_id = ?
    `;

    const last7DaysQuery = `
        SELECT COUNT(*) as count
        FROM sl_link_request
        INNER JOIN sl_user_links ON sl_link_request.link_map_id = sl_user_links.id
        WHERE sl_user_links.user_id = ?
        AND sl_link_request.timestamp >= datetime('now', '-7 days')
    `;

    const [linksResult, clicksResult, visitorsResult, last7DaysResult] = await env.DB.batch<{ count: number }>([
        env.DB.prepare(totalLinksQuery).bind(userId),
        env.DB.prepare(totalClicksQuery).bind(userId),
        env.DB.prepare(uniqueVisitorsQuery).bind(userId),
        env.DB.prepare(last7DaysQuery).bind(userId),
    ]);

    return {
        totalLinks: linksResult.results[0]?.count || 0,
        totalClicks: clicksResult.results[0]?.count || 0,
        uniqueVisitors: visitorsResult.results[0]?.count || 0,
        last7DaysClicks: last7DaysResult.results[0]?.count || 0,
    };
}
