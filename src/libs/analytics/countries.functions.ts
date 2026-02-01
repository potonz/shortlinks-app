import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

import { buildCountriesQuery } from "~/libs/analytics/countries.server";
import { auth } from "~/libs/auth/auth";

export const getCountries = createServerFn({ method: "GET" })
    .handler(async () => {
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

            const data = await buildCountriesQuery(10, userId);

            return {
                success: true,
                data,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching countries:", err);
                return {
                    success: false,
                    error: err.message,
                };
            }
            throw err;
        }
    });
