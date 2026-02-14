import { queryOptions } from "@tanstack/solid-query";

import { getClicksByTimeByShortId } from "~/libs/analytics/clicksByTimeByShortId.functions";

export const clicksByTimeQueryConfig = (id: number, days?: number) => queryOptions({
    queryKey: ["analytics", "clicks-by-time", id],
    queryFn: async () => {
        const result = await getClicksByTimeByShortId({ data: { id, days } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
