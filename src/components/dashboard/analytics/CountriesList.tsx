import { useQuery } from "@tanstack/solid-query";
import { For } from "solid-js";

import stylesCard from "../AnalyticsCard.module.css";
import styles from "./CountriesList.module.css";
import { countriesQueryConfig } from "./countriesQuery";

interface CountriesListProps {
    id: number;
}

export function CountriesList(props: CountriesListProps) {
    const analyticsQuery = useQuery(() => countriesQueryConfig(props.id));

    const data = () => analyticsQuery.data ?? [];
    const maxClicks = () => {
        const clicks = data().map(d => d.clicks);
        return clicks.length > 0 ? Math.max(...clicks) : 1;
    };

    return (
        <div class={stylesCard["analytics-card"]}>
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-medium text-zinc-400 mb-1">Top Countries</p>
                    <div class={`${stylesCard["value"]} text-3xl font-bold text-white mb-1`}>
                        {analyticsQuery.isPending ? "Loading..." : data().length}
                    </div>
                    <p class="text-sm text-zinc-500">
                        {analyticsQuery.error
                            ? `Error: ${analyticsQuery.error.message}`
                            : "By click count"}
                    </p>
                </div>
                <div class="text-zinc-400">
                    <span class="text-2xl"><i class="bi bi-globe" /></span>
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
                            const flag = () => getCountryFlag(item.country);

                            return (
                                <div class={styles["list-item"]}>
                                    <div class="flex items-center gap-3">
                                        <span class={styles["rank"]}>{index() + 1}</span>
                                        <span class={styles["flag"]}>{flag()}</span>
                                        <span class="text-white flex-1 truncate">{item.country}</span>
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
                <div class="py-4 text-center text-zinc-500">No country data available</div>
            )}
        </div>
    );
}

function getCountryFlag(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
