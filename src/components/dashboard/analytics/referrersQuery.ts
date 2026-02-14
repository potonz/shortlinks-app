import { queryOptions } from "@tanstack/solid-query";

import { getReferrersByShortId } from "~/libs/analytics/referrersByShortId.functions";

export const referrersQueryConfig = (id: number, limit?: number) => queryOptions({
    queryKey: ["analytics", "referrers", id],
    queryFn: async () => {
        const result = await getReferrersByShortId({ data: { id, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
