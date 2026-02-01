import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

import { auth } from "~/libs/auth/auth";
import { fetchLinkDetailsQuery } from "~/libs/links/fetchLinkDetails.server";

export const fetchLinkDetails = createServerFn({ method: "GET" })
    .inputValidator((input: string) => input)
    .handler(async ({ data: shortId }) => {
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

            return await fetchLinkDetailsQuery(shortId, userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching link details:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
