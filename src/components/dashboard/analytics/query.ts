import { queryOptions } from "@tanstack/solid-query";

import { getSummaryByShortId } from "~/libs/analytics/summaryByShortId.functions";

export const queryConfig = (shortId: string) => queryOptions({
    queryKey: ["analytics", "summary", shortId],
    queryFn: async () => {
        const result = await getSummaryByShortId({ data: { shortId } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
