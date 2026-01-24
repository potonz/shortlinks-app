import { Show } from "solid-js";

import styles from "./AnalyticsCard.module.css";

interface IAnalyticsCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function AnalyticsCard(props: IAnalyticsCardProps) {
    return (
        <div class={styles["analytics-card"]}>
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-zinc-400 mb-1">{props.title}</p>
                    <div class={`${styles["value"]} text-3xl font-bold text-white mb-1`}>{props.value}</div>
                    {props.subtitle && (
                        <p class="text-sm text-zinc-500">{props.subtitle}</p>
                    )}
                </div>
                <div
                    class={`${styles.icon} text-zinc-400`}
                >
                    <span class="text-2xl">{props.icon}</span>
                </div>
            </div>
            <Show when={props.trend}>
                {trend => (
                    <div
                        class="mt-4 flex items-center text-sm transition-all duration-300"
                        classList={{
                            "text-green-400": trend().isPositive,
                            "text-red-400": !trend().isPositive,
                        }}
                    >
                        <span>
                            {trend().isPositive ? "↑" : "↓"}
                            {" "}
                            {trend().value}
                            %
                        </span>
                        <span class="ml-2 text-zinc-500">from last period</span>
                    </div>
                )}
            </Show>
        </div>
    );
}
