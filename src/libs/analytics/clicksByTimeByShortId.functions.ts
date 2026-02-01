import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { buildClicksByTimeByShortIdQuery } from "~/libs/analytics/clicksByTimeByShortId.server";
import { auth } from "~/libs/auth/auth";

const inputValidator = z.object({
    shortId: z.string(),
    days: z.number().optional(),
});

export const getClicksByTimeByShortId = createServerFn({ method: "GET" })
    .inputValidator(inputValidator)
    .handler(async ({ data }) => {
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

            const result = await buildClicksByTimeByShortIdQuery(data.shortId, data.days || 30, userId);

            return {
                success: true,
                data: result,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching clicks by time by short ID:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
