export async function buildSummaryQuery(db: D1Database) {
    const totalLinksQuery = `
        SELECT COUNT(*) as count
        FROM sl_links_map
    `;

    const totalClicksQuery = `
        SELECT COUNT(*) as count
        FROM sl_link_request
    `;

    const uniqueVisitorsQuery = `
        SELECT COUNT(DISTINCT ip_address) as count
        FROM sl_link_request
    `;

    const last7DaysQuery = `
        SELECT COUNT(*) as count
        FROM sl_link_request
        WHERE timestamp >= datetime('now', '-7 days')
    `;

    const [linksResult, clicksResult, visitorsResult, last7DaysResult] = await db.batch<{ count: number }>([
        db.prepare(totalLinksQuery),
        db.prepare(totalClicksQuery),
        db.prepare(uniqueVisitorsQuery),
        db.prepare(last7DaysQuery),
    ]);

    return {
        totalLinks: linksResult.results[0]?.count || 0,
        totalClicks: clicksResult.results[0]?.count || 0,
        uniqueVisitors: visitorsResult.results[0]?.count || 0,
        last7DaysClicks: last7DaysResult.results[0]?.count || 0,
    };
}
