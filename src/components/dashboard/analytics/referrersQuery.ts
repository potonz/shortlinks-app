import { queryOptions } from "@tanstack/solid-query";

import { getReferrersByShortId } from "~/libs/analytics/referrersByShortId.functions";

export const referrersQueryConfig = (shortId: string, limit?: number) => queryOptions({
    queryKey: ["analytics", "referrers", shortId],
    queryFn: async () => {
        const result = await getReferrersByShortId({ data: { shortId, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
