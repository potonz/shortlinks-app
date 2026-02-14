import { queryOptions } from "@tanstack/solid-query";

import { fetchUserLinks } from "~/libs/shortlinks";

export const createLinksQuery = (page: number, limit: number) =>
    queryOptions({
        queryKey: ["links", "list", page],
        queryFn: async () => {
            const result = await fetchUserLinks({ data: { page, limit } });

            if (result.success) {
                return result;
            }

            throw new Error(result.error || "Failed to fetch links");
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });
