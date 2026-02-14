import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { deleteLinkQuery } from "~/libs/shortlinks/deleteLink.server";
import type { IDeleteLinkResult } from "~/types/links";

const validator = z.number();

export const deleteLink = createServerFn({ method: "POST" })
    .inputValidator(validator)
    .handler(async ({ data: id }): Promise<IDeleteLinkResult> => {
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

            return await deleteLinkQuery(id, userId);
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
