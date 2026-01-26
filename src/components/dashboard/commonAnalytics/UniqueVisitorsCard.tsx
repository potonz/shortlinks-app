import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

export function UniqueVisitorsCard() {
    const analyticsQuery = useQuery(() => queryConfig());

    const uniqueVisitors = () => analyticsQuery.data?.uniqueVisitors.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Unique Visitors"
            value={analyticsQuery.isPending ? "Loading..." : uniqueVisitors()}
            subtitle={analyticsQuery.error?.message}
            icon="👥"
        />
    );
}
