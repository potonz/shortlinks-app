import { useQuery } from "@tanstack/solid-query";
import { useServerFn } from "@tanstack/solid-start";
import { format } from "date-fns";
import { For, Match, Switch } from "solid-js";

import { getClicksByTime as getClicksByTimeServer } from "~/libs/analytics/clicksByTime.functions";

import stylesCard from "./AnalyticsCard.module.css";
import styles from "./ClicksByTimeChart.module.css";

export function ClicksByTimeChart() {
    const getClicksByTime = useServerFn(getClicksByTimeServer);

    const analyticsQuery = useQuery(() => ({
        queryKey: ["analytics", "clicks-by-time"],
        queryFn: async () => {
            const result = await getClicksByTime();

            if (result.success) {
                return result.data;
            }

            throw new Error(result.error);
        },
    }));

    const data = () => analyticsQuery.data ?? [];

    const maxClicks = () => {
        const clicks = data().map(d => d.clicks);
        return clicks.length > 0 ? Math.max(...clicks) : 1;
    };

    const lines = () => {
        const d = data();
        const max = maxClicks();
        const width = 100;
        const height = 60;
        const padding = 2;

        return d.map((point, index) => {
            const x = (index / (d.length - 1)) * width;
            const y = height - (point.clicks / max) * (height - padding * 2) - padding;
            return `${x},${y}`;
        }).join(" ");
    };

    const area = () => {
        const d = data();
        const max = maxClicks();
        const height = 60;
        const padding = 2;

        const firstPoint = d[0];
        const lastPoint = d[d.length - 1];

        if (!firstPoint || !lastPoint) {
            return `0,${height} 0,${height}`;
        }

        const y1 = height - (firstPoint.clicks / max) * (height - padding * 2) - padding;
        const y2 = height - (lastPoint.clicks / max) * (height - padding * 2) - padding;

        return `0,${y1} ${lines()} 100,${y2}`;
    };

    return (
        <div class={styles["clicks-by-time-chart"]}>
            <div class={stylesCard["analytics-card"]}>
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm font-medium text-zinc-400 mb-1">Clicks by Time</p>
                        <div class={`${stylesCard["value"]} text-3xl font-bold text-white mb-1`}>
                            {analyticsQuery.isPending ? "Loading..." : `${data().length} days`}
                        </div>
                        <p class="text-sm text-zinc-500">
                            {analyticsQuery.error
                                ? `Error: ${analyticsQuery.error.message}`
                                : "Last 30 days"}
                        </p>
                    </div>
                    <div class="text-zinc-400">
                        <span class="text-2xl">📈</span>
                    </div>
                </div>

                <Switch>
                    <Match when={analyticsQuery.isPending}>
                        <div class={styles["loading-state"]}>
                        </div>
                    </Match>
                    <Match when={analyticsQuery.isError}>
                        <div class={styles["error-state"]}>
                            <p class="text-sm text-red-400">Failed to load chart data</p>
                        </div>
                    </Match>
                    <Match when={data().length > 0}>
                        <div class={styles["chart-container"]}>
                            <svg viewBox="0 0 100 60" preserveAspectRatio="none" class={styles["chart"]}>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stop-color="#71717a" stop-opacity="0.5" />
                                        <stop offset="100%" stop-color="#71717a" stop-opacity="0.05" />
                                    </linearGradient>
                                </defs>
                                <polygon points={area()} fill="url(#chartGradient)" stroke="none" />
                                <polyline points={lines()} fill="none" stroke="#71717a" stroke-width="1" />
                            </svg>
                            <div class={styles["chart-labels"]}>
                                <For each={data()}>
                                    {point => (
                                        <span class={styles["chart-label"]}>
                                            {format(point.date, "d LLL")}
                                        </span>
                                    )}
                                </For>
                            </div>
                        </div>
                    </Match>
                    <Match when={data().length == 0}>
                        <div class={styles["empty-state"]}>
                            <p class="text-sm text-zinc-500">No data available</p>
                        </div>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}
