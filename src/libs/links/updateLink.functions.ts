import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { updateLinkQuery } from "~/libs/links/updateLink.server";
import type { IUpdateLinkResult } from "~/types/links";

const validator = z.object({
    shortId: z.string(),
    data: z.object({
        originalUrl: z.string().url().optional(),
        expiresAt: z.string().datetime().nullable().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const updateLink = createServerFn({ method: "POST" })
    .inputValidator(validator)
    .handler(async ({ data }): Promise<IUpdateLinkResult> => {
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

            return await updateLinkQuery(data, userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error updating link:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
