import { queryOptions } from "@tanstack/solid-query";

import { getClicksByTimeByShortId } from "~/libs/analytics/clicksByTimeByShortId.functions";

export const clicksByTimeQueryConfig = (
    id: number,
    days?: number,
    startDate?: string,
    endDate?: string,
) => queryOptions({
    queryKey: ["analytics", "clicks-by-time", id, days, startDate, endDate],
    queryFn: async () => {
        const result = await getClicksByTimeByShortId({ data: { id, days, startDate, endDate } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
