export async function buildClicksByTimeQuery(db: D1Database, days: number = 30) {
    const query = `
        SELECT
            substr(timestamp, 1, 10) as date,
            COUNT(*) as clicks
        FROM sl_link_request
        WHERE timestamp >= datetime('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
    `;

    const result = await db.prepare(query).bind(days).all<{ date: string; clicks: number }>();

    return result.results.map(row => ({
        date: row.date,
        clicks: row.clicks,
    }));
}
