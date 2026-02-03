import { queryOptions } from "@tanstack/solid-query";

import { getBrowsersByShortId } from "~/libs/analytics/browsersByShortId.functions";

export const browsersQueryConfig = (shortId: string, limit?: number) => queryOptions({
    queryKey: ["analytics", "browsers", shortId],
    queryFn: async () => {
        const result = await getBrowsersByShortId({ data: { shortId, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
