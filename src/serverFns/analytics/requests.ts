import { createServerFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { buildLinkRequestsQuery, buildLinkRequestsQueryValidator } from "~/libs/analytics/linkRequestsQuery";

export const getRequests = createServerFn({ method: "GET" })
    .inputValidator(buildLinkRequestsQueryValidator)
    .handler(async ({ data: params }) => {
        try {
            const result = await buildLinkRequestsQuery(env.DB, params);

            return {
                success: true,
                data: result,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching link requests:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
