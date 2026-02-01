import { queryOptions } from "@tanstack/solid-query";

import { getCountriesByShortId } from "~/libs/analytics/countriesByShortId.functions";

export const countriesQueryConfig = (shortId: string, limit?: number) => queryOptions({
    queryKey: ["analytics", "countries", shortId],
    queryFn: async () => {
        const result = await getCountriesByShortId({ data: { shortId, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
