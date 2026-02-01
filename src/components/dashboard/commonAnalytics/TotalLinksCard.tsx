import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

export function TotalLinksCard() {
    const analyticsQuery = useQuery(() => queryConfig());

    const totalLinks = () => analyticsQuery.data?.totalLinks.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Total Links Created"
            value={analyticsQuery.isPending ? "Loading..." : totalLinks()}
            subtitle={analyticsQuery.error?.message}
            icon={<i class="bi bi-link-45deg" />}
        />
    );
}
