export async function buildReferrersQuery(db: D1Database, limit: number = 10) {
    const query = `
        SELECT
            substr(referer, instr(referer, '://') + 3) as referrer,
            COUNT(*) as clicks
        FROM sl_link_request
        WHERE referer IS NOT NULL AND referer != ''
        GROUP BY referrer
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await db.prepare(query).bind(limit).all<{ referrer: string; clicks: number }>();

    return result.results.map(row => ({
        referrer: row.referrer,
        clicks: row.clicks,
    }));
}
