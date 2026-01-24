import { createServerFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { buildCountriesQuery } from "~/libs/analytics/countriesQuery";

export const getCountries = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const data = await buildCountriesQuery(env.DB, 10);

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
