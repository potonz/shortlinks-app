import { createFileRoute } from "@tanstack/solid-router";

import { ClicksByTimeChart } from "~/components/dashboard/ClicksByTimeChart";
import { Last7DaysClicksCard } from "~/components/dashboard/commonAnalytics/Last7DaysClicksCard";
import { TotalClicksCard } from "~/components/dashboard/commonAnalytics/TotalClicksCard";
import { TotalLinksCard } from "~/components/dashboard/commonAnalytics/TotalLinksCard";
import { UniqueVisitorsCard } from "~/components/dashboard/commonAnalytics/UniqueVisitorsCard";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div class="rounded p-8">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <TotalLinksCard />
                    <TotalClicksCard />
                    <UniqueVisitorsCard />
                    <Last7DaysClicksCard />
                </div>
                <div class="mb-8">
                    <ClicksByTimeChart />
                </div>
            </div>
        </div>
    );
}
