import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

export function Last7DaysClicksCard() {
    const analyticsQuery = useQuery(() => queryConfig());

    const last7DaysClicks = () => analyticsQuery.data?.last7DaysClicks.toLocaleString() ?? "";

    return (
        <AnalyticsCard
            title="Last 7 Days Clicks"
            value={analyticsQuery.isPending ? "Loading..." : last7DaysClicks()}
            subtitle={analyticsQuery.error?.message}
            icon="📈"
        />
    );
}
