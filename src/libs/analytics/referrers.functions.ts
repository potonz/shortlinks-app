import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { auth } from "~/libs/auth/auth";

import { buildReferrersQuery } from "~/libs/analytics/referrers.server";

export const getReferrers = createServerFn({ method: "GET" })
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

            const data = await buildReferrersQuery(10, userId);

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
