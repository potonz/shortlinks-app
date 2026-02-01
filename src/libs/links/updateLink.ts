import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
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

            if (data.data.originalUrl) {
                const result = await env.DB!.prepare(`
                    UPDATE sl_links_map 
                    SET target_url = ?
                    WHERE short_id = ?
                        AND EXISTS (
                            SELECT 1 FROM sl_user_links 
                            WHERE short_id = ? AND user_id = ?
                        )
                `).bind(data.data.originalUrl, data.shortId, data.shortId, userId).run();

                if (!result.success || result.meta?.changes === 0) {
                    return {
                        success: false,
                        error: "Link not found or access denied",
                    };
                }
            }

            return {
                success: true,
            };
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
