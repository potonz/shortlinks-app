import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { buildBrowsersByShortIdQuery } from "~/libs/analytics/browsersByShortId.server";
import { auth } from "~/libs/auth/auth";

const inputValidator = z.object({
    id: z.number(),
    limit: z.number().optional(),
});

export const getBrowsersByShortId = createServerFn({ method: "GET" })
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

            const result = await buildBrowsersByShortIdQuery(data.id, data.limit || 10, userId);

            return {
                success: true,
                data: result,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching browsers by short ID:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
