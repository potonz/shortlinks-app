import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { getShortLinksManager } from "~/libs/shortlinks/manager";
import type { IDeleteLinkResult } from "~/types/links";

const validator = z.string();

export const deleteLink = createServerFn({ method: "POST" })
    .inputValidator(validator)
    .handler(async ({ data: shortId }): Promise<IDeleteLinkResult> => {
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

            const deleteUserLinkResult = await env.DB!.prepare(`
                DELETE FROM sl_user_links 
                WHERE short_id = ? AND user_id = ?
            `).bind(shortId, userId).run();

            if (!deleteUserLinkResult.success || deleteUserLinkResult.meta?.changes === 0) {
                return {
                    success: false,
                    error: "Link not found or access denied",
                };
            }

            const manager = await getShortLinksManager();
            await manager.removeShortLink(shortId);

            return {
                success: true,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error deleting link:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
