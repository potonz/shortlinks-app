import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./summaryQuery";

interface UniqueVisitorsCardProps {
    id: number;
}

export function UniqueVisitorsCard(props: UniqueVisitorsCardProps) {
    const analyticsQuery = useQuery(() => queryConfig(props.id));

    const uniqueVisitors = () => analyticsQuery.data?.uniqueVisitors.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Unique Visitors"
            value={analyticsQuery.isPending ? "Loading..." : uniqueVisitors()}
            subtitle={analyticsQuery.error?.message}
            icon={<i class="bi bi-people" />}
        />
    );
}
