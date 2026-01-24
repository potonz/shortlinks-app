import { createServerFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { buildSummaryQuery } from "~/libs/analytics/summaryQuery";

export const getSummary = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const summary = await buildSummaryQuery(env.DB);

            return {
                success: true,
                data: summary,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching summary analytics:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
