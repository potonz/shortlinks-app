import { queryOptions } from "@tanstack/solid-query";

import { getSummary } from "~/libs/analytics/summary.functions";

export const queryConfig = () => queryOptions({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
        const result = await getSummary();

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
