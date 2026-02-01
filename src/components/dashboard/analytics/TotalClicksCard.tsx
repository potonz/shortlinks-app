import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

interface TotalClicksCardProps {
    shortId: string;
}

export function TotalClicksCard(props: TotalClicksCardProps) {
    const analyticsQuery = useQuery(() => queryConfig(props.shortId));

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
