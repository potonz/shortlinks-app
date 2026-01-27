import { createServerFn } from "@tanstack/solid-start";

import { buildLinkRequestsQuery, buildLinkRequestsQueryValidator } from "~/libs/analytics/linkRequests.server";

export const getRequests = createServerFn({ method: "GET" })
    .inputValidator(buildLinkRequestsQueryValidator)
    .handler(async ({ data: params }) => {
        try {
            const result = await buildLinkRequestsQuery(params);

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
