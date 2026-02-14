import { queryOptions } from "@tanstack/solid-query";

import { getSummaryByShortId } from "~/libs/analytics/summaryByShortId.functions";

export const queryConfig = (id: number) => queryOptions({
    queryKey: ["analytics", "summary", id],
    queryFn: async () => {
        const result = await getSummaryByShortId({ data: { id } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
