import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { fetchUserLinksQuery } from "~/libs/links/fetchUserLinks.server";
import type { IFetchLinksResult } from "~/types/links";

const paginationValidator = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export const fetchUserLinks = createServerFn({ method: "GET" })
    .inputValidator(paginationValidator)
    .handler(async ({ data }): Promise<IFetchLinksResult> => {
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

            return await fetchUserLinksQuery(data, userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching user links:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
