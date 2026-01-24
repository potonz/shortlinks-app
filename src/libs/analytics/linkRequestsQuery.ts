import { z } from "zod";

export const buildLinkRequestsQueryValidator = z.object({
    page: z.optional(z.number().min(1)),
    pageSize: z.optional(z.number().min(1).max(100)),
    startDate: z.optional(z.iso.datetime()),
    endDate: z.optional(z.iso.datetime()),
    country: z.optional(z.string()),
    referrer: z.optional(z.string()),
});

export async function buildLinkRequestsQuery(
    db: D1Database,
    params: z.infer<typeof buildLinkRequestsQueryValidator> = {},
) {
    const { page = 1, pageSize = 20, startDate, endDate, country, referrer } = params;
    const offset = (page - 1) * pageSize;

    let whereClause = "WHERE 1=1";
    const bindings: unknown[] = [];

    if (startDate) {
        whereClause += " AND timestamp >= ?";
        bindings.push(startDate);
    }

    if (endDate) {
        whereClause += " AND timestamp <= ?";
        bindings.push(endDate);
    }

    if (country) {
        whereClause += " AND country = ?";
        bindings.push(country);
    }

    if (referrer) {
        whereClause += " AND referer LIKE ?";
        bindings.push(`%${referrer}%`);
    }

    const countQuery = `SELECT COUNT(*) as total FROM sl_link_request ${whereClause}`;
    const dataQuery = `
        SELECT
            id,
            short_id,
            ip_address as ip,
            country,
            region,
            city,
            latitude,
            longitude,
            timezone,
            asn,
            as_organization as asOrganization,
            user_agent as userAgent,
            referer,
            timestamp
        FROM sl_link_request
        ${whereClause}
        ORDER BY timestamp DESC
        LIMIT ?
        OFFSET ?
    `;

    interface TLinkRequest {
        id: number;
        short_id: string;
        ip: string;
        country: string;
        region: string;
        city: string;
        latitude: number | null;
        longitude: number | null;
        timezone: string;
        asn: string;
        asOrganization: string;
        userAgent: string;
        referer: string | null;
        timestamp: string;
    }

    const [countResult, dataResult] = await db.batch([
        db.prepare(countQuery).bind(...bindings),
        db.prepare(dataQuery).bind(...bindings, pageSize, offset),
    ]) as [
        D1Result<{ total: number }>,
        D1Result<TLinkRequest>,
    ];

    return {
        data: dataResult.results,
        total: countResult.results[0]?.total || 0,
        page,
        pageSize,
    };
}
