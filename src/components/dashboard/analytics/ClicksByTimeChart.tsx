import { useQuery } from "@tanstack/solid-query";
import { format } from "date-fns";
import { createSignal, For, Match, Show, Switch } from "solid-js";

import stylesCard from "../AnalyticsCard.module.css";
import styles from "../ClicksByTimeChart.module.css";
import { clicksByTimeQueryConfig } from "./clicksByTimeQuery";
import { DateRangePicker, type DateRangePreset } from "./DateRangePicker";

interface ClicksByTimeChartProps {
    id: number;
}

interface TrendData {
    totalChange: number;
    trendIndicator: "up" | "down" | "neutral";
}

interface TooltipData {
    date: Date;
    clicks: number;
    x: number;
    y: number;
}

function calculateTrend(data: { clicks: number }[]): TrendData {
    if (data.length < 2) {
        return { totalChange: 0, trendIndicator: data.length === 1 && data[0].clicks > 0 ? "up" : "neutral" };
    }

    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const previousTotalClicks = data.slice(0, data.length - 1).reduce((sum, item) => sum + item.clicks, 0);

    const totalChange = previousTotalClicks > 0 ? ((totalClicks - previousTotalClicks) / previousTotalClicks) * 100 : 0;
    const trendIndicator = totalChange > 0 ? "up" : totalChange < 0 ? "down" : "neutral";

    return { totalChange, trendIndicator };
}

export function ClicksByTimeChart(props: ClicksByTimeChartProps) {
    const [dateRange, setDateRange] = createSignal<{
        days?: number;
        startDate?: string;
        endDate?: string;
    }>({ days: 30 });

    const [tooltip, setTooltip] = createSignal<TooltipData | null>(null);
    const [isTransitioning, setIsTransitioning] = createSignal(false);

    const analyticsQuery = useQuery(() =>
        clicksByTimeQueryConfig(
            props.id,
            dateRange().days,
            dateRange().startDate,
            dateRange().endDate,
        ),
    );

    const data = () => analyticsQuery.data ?? [];

    const trend = () => calculateTrend(data());

    const handleDateRangeChange = (preset: DateRangePreset, startDate?: Date, endDate?: Date) => {
        setIsTransitioning(true);
        setTooltip(null);

        if (preset === "custom" && startDate && endDate) {
            setDateRange({
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            });
        }
        else {
            const daysMap: Record<string, number> = {
                "7d": 7,
                "30d": 30,
                "90d": 90,
                "1y": 365,
            };
            setDateRange({ days: daysMap[preset] || 30 });
        }

        setTimeout(() => setIsTransitioning(false), 300);
    };

    const maxClicks = () => {
        const clicks = data().map(d => d.clicks);
        return clicks.length > 0 ? Math.max(...clicks) : 1;
    };

    const lines = () => {
        const d = data();
        if (d.length < 2) return "";

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

        if (!firstPoint || !lastPoint || d.length < 2) {
            return `0,${height} 0,${height}`;
        }

        const y1 = height - (firstPoint.clicks / max) * (height - padding * 2) - padding;
        const y2 = height - (lastPoint.clicks / max) * (height - padding * 2) - padding;

        return `0,${y1} ${lines()} 100,${y2}`;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const d = data();
        if (d.length < 2) return;

        const container = e.currentTarget as HTMLDivElement;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const index = Math.round((x / 100) * (d.length - 1));
        const point = d[index];

        if (point) {
            const max = maxClicks();
            const height = 60;
            const padding = 2;
            const y = height - (point.clicks / max) * (height - padding * 2) - padding;
            const yPos = (y / height) * rect.height;

            setTooltip({
                date: point.date,
                clicks: point.clicks,
                x: e.clientX - rect.left,
                y: yPos,
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const getDateRangeLabel = () => {
        const range = dateRange();
        if (range.startDate && range.endDate) {
            return `${format(new Date(range.startDate), "MMM d")} - ${format(new Date(range.endDate), "MMM d, yyyy")}`;
        }
        const days = range.days || 30;
        return `Last ${days} days`;
    };

    return (
        <div class={stylesCard["analytics-card"]}>
            <div class="flex flex-col gap-4 mb-4">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm font-medium text-zinc-400 mb-1">Clicks by Time</p>
                        <div class={`${stylesCard["value"]} text-3xl font-bold text-white mb-1`}>
                            {analyticsQuery.isPending ? "Loading..." : `${data().length} days`}
                        </div>
                        <p class="text-sm text-zinc-500">
                            {analyticsQuery.error
                                ? `Error: ${analyticsQuery.error.message}`
                                : getDateRangeLabel()}
                        </p>
                    </div>
                    <div class="text-zinc-400">
                        <span class="text-2xl"><i class="bi bi-bar-chart-line" /></span>
                    </div>
                </div>

                <Show when={!analyticsQuery.isPending && !analyticsQuery.error && data().length > 0}>
                    <div
                        class="flex items-center text-sm"
                        classList={{
                            "text-green-400": trend().trendIndicator === "up",
                            "text-red-400": trend().trendIndicator === "down",
                            "text-zinc-500": trend().trendIndicator === "neutral",
                        }}
                    >
                        <span>
                            {trend().trendIndicator === "up" ? "↑" : trend().trendIndicator === "down" ? "↓" : "→"}
                            {" "}
                            {Math.abs(trend().totalChange).toFixed(1)}
                            %
                        </span>
                        <span class="ml-2 text-zinc-500">vs previous period</span>
                    </div>
                </Show>

                <DateRangePicker onDateRangeChange={handleDateRangeChange} />
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
                    <div
                        class={styles["chart-wrapper"]}
                        classList={{ [styles["transitioning"]]: isTransitioning() }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div class={styles["chart-container"]}>
                            <svg viewBox="0 0 100 60" preserveAspectRatio="none" class={styles["chart"]}>
                                <defs>
                                    <linearGradient id="chartGradientShortId" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stop-color="#71717a" stop-opacity="0.5" />
                                        <stop offset="100%" stop-color="#71717a" stop-opacity="0.05" />
                                    </linearGradient>
                                </defs>
                                <polygon points={area()} fill="url(#chartGradientShortId)" stroke="none" />
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

                        <Show when={tooltip()}>
                            {t => (
                                <div
                                    class={styles["tooltip"]}
                                    style={{
                                        left: `${t().x}px`,
                                        top: `${t().y - 10}px`,
                                    }}
                                >
                                    <div class={styles["tooltip-date"]}>{format(t().date, "MMM d, yyyy")}</div>
                                    <div class={styles["tooltip-clicks"]}>
                                        <span class={styles["tooltip-icon"]}>👆</span>
                                        {t().clicks}
                                        {" "}
                                        clicks
                                    </div>
                                </div>
                            )}
                        </Show>
                    </div>
                </Match>
                <Match when={data().length == 0}>
                    <div class={styles["empty-state"]}>
                        <p class="text-sm text-zinc-500">No data available</p>
                    </div>
                </Match>
            </Switch>
        </div>
    );
}
