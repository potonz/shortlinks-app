import { useQuery } from "@tanstack/solid-query";
import { For } from "solid-js";

import stylesCard from "../AnalyticsCard.module.css";
import styles from "./ReferrersList.module.css";
import { referrersQueryConfig } from "./referrersQuery";

interface ReferrersListProps {
    id: number;
}

export function ReferrersList(props: ReferrersListProps) {
    const analyticsQuery = useQuery(() => referrersQueryConfig(props.id));

    const data = () => analyticsQuery.data ?? [];
    const maxClicks = () => {
        const clicks = data().map(d => d.clicks);
        return clicks.length > 0 ? Math.max(...clicks) : 1;
    };

    return (
        <div class={stylesCard["analytics-card"]}>
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-medium text-zinc-400 mb-1">Top Referrers</p>
                    <div class={`${stylesCard["value"]} text-3xl font-bold text-white mb-1`}>
                        {analyticsQuery.isPending ? "Loading..." : data().length}
                    </div>
                    <p class="text-sm text-zinc-500">
                        {analyticsQuery.error
                            ? `Error: ${analyticsQuery.error.message}`
                            : "Traffic sources"}
                    </p>
                </div>
                <div class="text-zinc-400">
                    <span class="text-2xl"><i class="bi bi-link-45deg" /></span>
                </div>
            </div>

            {analyticsQuery.isPending && (
                <div class="py-4 text-center text-zinc-500">Loading...</div>
            )}

            {analyticsQuery.isError && (
                <div class="py-4 text-center text-red-400">Failed to load data</div>
            )}

            {data().length > 0 && (
                <div class={styles["list-container"]}>
                    <For each={data()}>
                        {(item, index) => {
                            const percentage = () => (item.clicks / maxClicks()) * 100;

                            return (
                                <div class={styles["list-item"]}>
                                    <div class="flex items-center gap-3">
                                        <span class={styles["rank"]}>{index() + 1}</span>
                                        <span class="text-white flex-1 truncate" title={item.referrer}>
                                            {item.referrer === "Direct"
                                                ? (
                                                    <span class="flex items-center gap-2">
                                                        <i class="bi bi-house-door" />
                                                        Direct
                                                    </span>
                                                )
                                                : item.referrer}
                                        </span>
                                        <span class="text-zinc-400 text-sm">{item.clicks.toLocaleString()}</span>
                                    </div>
                                    <div class={styles["bar-container"]}>
                                        <div
                                            class={styles["bar"]}
                                            style={{ width: `${percentage()}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            )}

            {data().length === 0 && !analyticsQuery.isPending && !analyticsQuery.isError && (
                <div class="py-4 text-center text-zinc-500">No referrer data available</div>
            )}
        </div>
    );
}
