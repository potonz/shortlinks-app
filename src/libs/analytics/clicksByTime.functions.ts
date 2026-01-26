import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { auth } from "~/libs/auth/auth";

import { buildClicksByTimeQuery } from "~/libs/analytics/clicksByTime.server";

export const getClicksByTime = createServerFn({ method: "GET" })
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

            const data = await buildClicksByTimeQuery(env.DB, 30, userId);

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
