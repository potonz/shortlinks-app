import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

export function TotalClicksCard() {
    const analyticsQuery = useQuery(() => queryConfig());

    const totalClicks = () => analyticsQuery.data?.totalClicks.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Total Clicks"
            value={analyticsQuery.isPending ? "Loading..." : totalClicks()}
            subtitle={analyticsQuery.error?.message}
            icon="📊"
        />
    );
}
