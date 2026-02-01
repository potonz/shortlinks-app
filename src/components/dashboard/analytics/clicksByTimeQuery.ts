import { queryOptions } from "@tanstack/solid-query";

import { getClicksByTimeByShortId } from "~/libs/analytics/clicksByTimeByShortId.functions";

export const clicksByTimeQueryConfig = (shortId: string, days?: number) => queryOptions({
    queryKey: ["analytics", "clicks-by-time", shortId],
    queryFn: async () => {
        const result = await getClicksByTimeByShortId({ data: { shortId, days } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
