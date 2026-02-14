import { useQuery } from "@tanstack/solid-query";

import { AnalyticsCard } from "../AnalyticsCard";
import { queryConfig } from "./summaryQuery";

interface FirstRequestCardProps {
    id: number;
}

export function FirstRequestCard(props: FirstRequestCardProps) {
    const analyticsQuery = useQuery(() => queryConfig(props.id));

    const firstRequest = () => {
        if (!analyticsQuery.data?.firstRequest) {
            return "No data";
        }
        const date = new Date(analyticsQuery.data.firstRequest);
        return date.toLocaleDateString();
    };

    return (
        <AnalyticsCard
            title="First Request"
            value={analyticsQuery.isPending ? "Loading..." : firstRequest()}
            subtitle={analyticsQuery.error?.message}
            icon={<i class="bi bi-calendar-event" />}
        />
    );
}
