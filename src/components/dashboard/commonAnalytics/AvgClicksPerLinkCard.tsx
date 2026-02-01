import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./query";

export function AvgClicksPerLinkCard() {
    const analyticsQuery = useQuery(() => queryConfig());

    const avgClicks = () => {
        if (!analyticsQuery.data || analyticsQuery.data.totalLinks === 0) {
            return "0";
        }
        const avg = analyticsQuery.data.totalClicks / analyticsQuery.data.totalLinks;
        return avg.toFixed(1);
    };

    return (
        <AnalyticsCard
            title="Avg Clicks Per Link"
            value={analyticsQuery.isPending ? "Loading..." : avgClicks()}
            subtitle={analyticsQuery.error?.message}
            icon={<i class="bi bi-calculator" />}
        />
    );
}
