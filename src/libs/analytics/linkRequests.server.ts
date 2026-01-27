import { env } from "cloudflare:workers";
import { z } from "zod";

import type { TLinkRequest } from "./schemas";

export const buildLinkRequestsQueryValidator = z.object({
    page: z.number().min(1),
    pageSize: z.number().min(1).max(100),
    startDate: z.optional(z.iso.datetime()),
    endDate: z.optional(z.iso.datetime()),
    country: z.optional(z.string()),
    referrer: z.optional(z.string()),
    userId: z.string(),
});

export async function buildLinkRequestsQuery(
    params: z.infer<typeof buildLinkRequestsQueryValidator>,
) {
    const { page, pageSize, startDate, endDate, country, referrer, userId } = params;
    const offset = (page - 1) * pageSize;

    let whereClause = "WHERE sl_user_links.user_id = ?";
    const bindings: unknown[] = [userId];

    if (startDate) {
        whereClause += " AND sl_link_request.timestamp >= ?";
        bindings.push(startDate);
    }

    if (endDate) {
        whereClause += " AND sl_link_request.timestamp <= ?";
        bindings.push(endDate);
    }

    if (country) {
        whereClause += " AND sl_link_request.country = ?";
        bindings.push(country);
    }

    if (referrer) {
        whereClause += " AND sl_link_request.referer LIKE ?";
        bindings.push(`%${referrer}%`);
    }

    const countQuery = `SELECT COUNT(*) as total FROM sl_link_request ${whereClause}`;
    const dataQuery = `
        SELECT
            sl_link_request.id,
            sl_link_request.short_id,
            sl_link_request.ip_address as ip,
            sl_link_request.country,
            sl_link_request.region,
            sl_link_request.city,
            sl_link_request.latitude,
            sl_link_request.longitude,
            sl_link_request.timezone,
            sl_link_request.asn,
            sl_link_request.as_organization as asOrganization,
            sl_link_request.user_agent as userAgent,
            sl_link_request.referer,
            sl_link_request.timestamp,
            sl_user_links.user_id as userId
        FROM sl_link_request
        ${whereClause}
        ORDER BY sl_link_request.timestamp DESC
        LIMIT ?
        OFFSET ?
    `;

    const [countResult, dataResult] = await env.DB.batch([
        env.DB.prepare(countQuery).bind(...bindings),
        env.DB.prepare(dataQuery).bind(...bindings, pageSize, offset),
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
