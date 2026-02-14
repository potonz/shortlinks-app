import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { buildSummaryByShortIdQuery } from "~/libs/analytics/summaryByShortId.server";
import { auth } from "~/libs/auth/auth";

const inputValidator = z.object({
    id: z.number(),
});

export const getSummaryByShortId = createServerFn({ method: "GET" })
    .inputValidator(inputValidator)
    .handler(async ({ data: validatedData }) => {
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

            const result = await buildSummaryByShortIdQuery(validatedData.id, userId);

            return {
                success: true,
                data: result,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching summary by short ID:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
