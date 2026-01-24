import { createFileRoute } from "@tanstack/solid-router";

import { AnalyticsCard } from "~/components/dashboard/AnalyticsCard";
import type { IAnalyticsSummary } from "~/types/analytics";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    const summary: IAnalyticsSummary = {
        totalLinks: 156,
        totalClicks: 12345,
        uniqueVisitors: 8921,
        last7DaysClicks: 2341,
    };

    return (
        <div class="rounded p-8">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <AnalyticsCard
                        title="Total Links Created"
                        value={summary.totalLinks}
                        icon="🔗"
                        trend={{
                            value: 12,
                            isPositive: true,
                        }}
                    />
                    <AnalyticsCard
                        title="Total Clicks"
                        value={summary.totalClicks.toLocaleString()}
                        icon="📊"
                        trend={{
                            value: 8,
                            isPositive: true,
                        }}
                    />
                    <AnalyticsCard
                        title="Unique Visitors"
                        value={summary.uniqueVisitors.toLocaleString()}
                        icon="👥"
                        trend={{
                            value: 15,
                            isPositive: true,
                        }}
                    />
                    <AnalyticsCard
                        title="Last 7 Days Clicks"
                        value={summary.last7DaysClicks.toLocaleString()}
                        icon="📈"
                        trend={{
                            value: 23,
                            isPositive: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
