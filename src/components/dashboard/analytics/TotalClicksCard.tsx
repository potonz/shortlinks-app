import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./summaryQuery";

interface TotalClicksCardProps {
    id: number;
}

export function TotalClicksCard(props: TotalClicksCardProps) {
    const analyticsQuery = useQuery(() => queryConfig(props.id));

    const totalClicks = () => analyticsQuery.data?.totalClicks.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Total Clicks"
            value={analyticsQuery.isPending ? "Loading..." : totalClicks()}
            subtitle={analyticsQuery.error?.message}
            icon={<i class="bi bi-cursor" />}
        />
    );
}
