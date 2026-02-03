import { createFileRoute } from "@tanstack/solid-router";

import { BrowserList } from "~/components/dashboard/analytics/BrowserList";
import { ClicksByTimeChart } from "~/components/dashboard/analytics/ClicksByTimeChart";
import { CountriesList } from "~/components/dashboard/analytics/CountriesList";
import { FirstRequestCard } from "~/components/dashboard/analytics/FirstRequestCard";
import { Last7DaysClicksCard } from "~/components/dashboard/analytics/Last7DaysClicksCard";
import { ReferrersList } from "~/components/dashboard/analytics/ReferrersList";
import { TotalClicksCard } from "~/components/dashboard/analytics/TotalClicksCard";
import { UniqueVisitorsCard } from "~/components/dashboard/analytics/UniqueVisitorsCard";

export const Route = createFileRoute("/dashboard/links/$shortId/analytics")({
    component: RouteComponent,
});

function RouteComponent() {
    const params = Route.useParams();
    const navigate = Route.useNavigate();

    const shortId = () => params().shortId;

    const handleBack = () => {
        navigate({ to: "/dashboard/links" });
    };

    return (
        <div class="max-w-7xl mx-auto">
            <div class="mb-8">
                <button
                    onClick={handleBack}
                    class="text-zinc-400 hover:text-white transition-colors mb-4 inline-flex items-center gap-2"
                >
                    <i class="bi bi-arrow-left" />
                    Back to Links
                </button>
                <h1 class="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p class="text-zinc-400">
                    Short link:
                    <span class="text-zinc-200 font-mono ml-1">{shortId()}</span>
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <TotalClicksCard shortId={shortId()} />
                <UniqueVisitorsCard shortId={shortId()} />
                <Last7DaysClicksCard shortId={shortId()} />
                <FirstRequestCard shortId={shortId()} />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <ClicksByTimeChart shortId={shortId()} />
                </div>
                <CountriesList shortId={shortId()} />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ReferrersList shortId={shortId()} />
                <BrowserList shortId={shortId()} />
            </div>
        </div>
    );
}
