import { queryOptions } from "@tanstack/solid-query";

import { getBrowsersByShortId } from "~/libs/analytics/browsersByShortId.functions";

export const browsersQueryConfig = (id: number, limit?: number) => queryOptions({
    queryKey: ["analytics", "browsers", id],
    queryFn: async () => {
        const result = await getBrowsersByShortId({ data: { id, limit } });

        if (result.success) {
            return result.data;
        }

        throw new Error(result.error);
    },
});
