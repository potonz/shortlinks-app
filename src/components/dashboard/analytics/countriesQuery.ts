import { queryOptions } from "@tanstack/solid-query";

import { getCountriesByShortId } from "~/libs/analytics/countriesByShortId.functions";

export const countriesQueryConfig = (id: number, limit?: number) => queryOptions({
    queryKey: ["analytics", "countries", id],
    queryFn: async () => {
        const result = await getCountriesByShortId({ data: { id, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
