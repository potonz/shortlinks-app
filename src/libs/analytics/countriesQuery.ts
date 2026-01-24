export async function buildCountriesQuery(db: D1Database, limit: number = 10) {
    const query = `
        SELECT
            country,
            COUNT(*) as clicks
        FROM sl_link_request
        WHERE country IS NOT NULL AND country != ''
        GROUP BY country
        ORDER BY clicks DESC
        LIMIT ?
    `;

    const result = await db.prepare(query).bind(limit).all<{ country: string; clicks: number }>();

    return result.results.map(row => ({
        country: row.country,
        clicks: row.clicks,
    }));
}
