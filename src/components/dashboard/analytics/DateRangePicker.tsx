import { subDays } from "date-fns";
import { createSignal, For, Show } from "solid-js";

import styles from "./DateRangePicker.module.css";

export type DateRangePreset = "7d" | "30d" | "90d" | "1y" | "custom";

interface DateRangePickerProps {
    onDateRangeChange: (preset: DateRangePreset, startDate?: Date, endDate?: Date) => void;
    initialPreset?: DateRangePreset;
}

export function DateRangePicker(props: DateRangePickerProps) {
    const [selectedPreset, setSelectedPreset] = createSignal<DateRangePreset>(props.initialPreset || "30d");
    const [showCustom, setShowCustom] = createSignal(false);
    const [customStart, setCustomStart] = createSignal("");
    const [customEnd, setCustomEnd] = createSignal("");

    const presets: { value: DateRangePreset; label: string }[] = [
        { value: "7d", label: "7 days" },
        { value: "30d", label: "30 days" },
        { value: "90d", label: "90 days" },
        { value: "1y", label: "1 year" },
        { value: "custom", label: "Custom" },
    ];

    const getPresetDates = (preset: DateRangePreset): { start: Date; end: Date } => {
        const now = new Date();
        switch (preset) {
            case "7d":
                return { start: subDays(now, 7), end: now };
            case "30d":
                return { start: subDays(now, 30), end: now };
            case "90d":
                return { start: subDays(now, 90), end: now };
            case "1y":
                return { start: subDays(now, 365), end: now };
            default:
                return { start: subDays(now, 30), end: now };
        }
    };

    const handlePresetClick = (preset: DateRangePreset) => {
        setSelectedPreset(preset);

        if (preset === "custom") {
            setShowCustom(true);
            return;
        }

        setShowCustom(false);
        const { start, end } = getPresetDates(preset);
        props.onDateRangeChange(preset, start, end);
    };

    const handleCustomApply = () => {
        const startDate = customStart() ? new Date(customStart()) : undefined;
        const endDate = customEnd() ? new Date(customEnd()) : undefined;

        if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            props.onDateRangeChange("custom", startDate, endDate);
            setShowCustom(false);
        }
    };

    const handleCancel = () => {
        setShowCustom(false);
        setCustomStart("");
        setCustomEnd("");
        setSelectedPreset("30d");
    };

    return (
        <div class={styles["date-range-picker"]}>
            <div class={styles["preset-buttons"]}>
                <For each={presets}>
                    {preset => (
                        <button
                            type="button"
                            class={styles["preset-btn"]}
                            classList={{
                                [styles["active"]]: selectedPreset() === preset.value,
                            }}
                            onClick={() => handlePresetClick(preset.value)}
                        >
                            {preset.label}
                        </button>
                    )}
                </For>
            </div>

            <Show when={showCustom()}>
                <div class={styles["custom-date-container"]}>
                    <div class={styles["date-inputs"]}>
                        <div class={styles["date-field"]}>
                            <label class={styles["date-label"]}>Start Date</label>
                            <input
                                type="date"
                                class={styles["date-input"]}
                                value={customStart()}
                                onInput={e => setCustomStart(e.currentTarget.value)}
                            />
                        </div>
                        <div class={styles["date-field"]}>
                            <label class={styles["date-label"]}>End Date</label>
                            <input
                                type="date"
                                class={styles["date-input"]}
                                value={customEnd()}
                                onInput={e => setCustomEnd(e.currentTarget.value)}
                            />
                        </div>
                    </div>
                    <div class={styles["custom-actions"]}>
                        <button
                            type="button"
                            class={styles["cancel-btn"]}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class={styles["apply-btn"]}
                            onClick={handleCustomApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
}
