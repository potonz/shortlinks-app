import { createServerFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { buildClicksByTimeQuery } from "~/libs/analytics/clicksByTimeQuery";

export const getClicksByTime = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const data = await buildClicksByTimeQuery(env.DB, 30);

            return {
                success: true,
                data,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching clicks by time:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
