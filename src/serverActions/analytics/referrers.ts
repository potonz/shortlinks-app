import { createServerFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { buildReferrersQuery } from "~/libs/analytics/referrersQuery";

export const getReferrers = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const data = await buildReferrersQuery(env.DB, 10);

            return {
                success: true,
                data,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching top referrers:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
