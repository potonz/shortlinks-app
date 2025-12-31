import { createServerOnlyFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

export const recordLinkRequest = createServerOnlyFn(
    async (shortId: string, request: Request) => {
        try {
            // Extract IP address
            const clientIp = request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip");

            // Extract Cloudflare request details
            const cf = request.cf;

            // Prepare data for insertion
            const data = {
                short_id: shortId,
                ip_address: clientIp || null,
                country: cf?.country || null,
                region: cf?.region || null,
                city: cf?.city || null,
                latitude: cf?.latitude ? parseFloat(cf.latitude) : null,
                longitude: cf?.longitude ? parseFloat(cf.longitude) : null,
                timezone: cf?.timezone || null,
                asn: cf?.asn ? parseInt(cf.asn) : null,
                as_organization: cf?.asOrganization || null,
                user_agent: request.headers.get("user-agent") || null,
                referer: request.headers.get("referer") || null,
            };

            // Insert into D1 database
            const result = await env.DB.prepare(`
INSERT INTO sl_link_request (
short_id, ip_address, country, region, city, latitude, longitude, 
timezone, asn, as_organization, user_agent, referer
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            )
                .bind(
                    data.short_id,
                    data.ip_address,
                    data.country,
                    data.region,
                    data.city,
                    data.latitude,
                    data.longitude,
                    data.timezone,
                    data.asn,
                    data.as_organization,
                    data.user_agent,
                    data.referer,
                )
                .run();

            return result;
        }
        catch (error) {
            console.error("Failed to record link request:", error);
            throw error;
        }
    },
);
