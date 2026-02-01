import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { buildReferrersByShortIdQuery } from "~/libs/analytics/referrersByShortId.server";
import { auth } from "~/libs/auth/auth";

const inputValidator = z.object({
    shortId: z.string(),
    limit: z.number().optional(),
});

export const getReferrersByShortId = createServerFn({ method: "GET" })
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

            const result = await buildReferrersByShortIdQuery(data.shortId, data.limit || 10, userId);

            return {
                success: true,
                data: result,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching referrers by short ID:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
