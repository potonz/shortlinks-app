import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { updateLinkQuery } from "~/libs/shortlinks/updateLink.server";
import type { IUpdateLinkResult } from "~/types/links";

const validator = z.object({
    shortId: z.string(),
    baseUrlId: z.number().nullable(),
    targetUrl: z.string(),
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

            return await updateLinkQuery(data.shortId, data.targetUrl, data.baseUrlId);
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
