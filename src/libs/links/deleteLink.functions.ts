import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { deleteLinkQuery } from "~/libs/links/deleteLink.server";
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

            return await deleteLinkQuery(shortId, userId);
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
