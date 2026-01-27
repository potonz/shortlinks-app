import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

import { buildSummaryQuery } from "~/libs/analytics/summary.server";
import { auth } from "~/libs/auth/auth";

export const getSummary = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (!userId) {
                return {
                    success: false,
                    error: "User not authenticated",
                };
            }

            const summary = await buildSummaryQuery(userId);

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
