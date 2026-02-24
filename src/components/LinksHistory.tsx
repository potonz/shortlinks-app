import type { IBaseUrlRecord } from "@potonz/shortlinks-manager";
import { ClientOnly } from "@tanstack/solid-router";
import { For, Show } from "solid-js";

import { createBaseUrlsHelper } from "~/utils/urls";

import { useLinkHistory } from "../stores/linkHistoryStore";
import { CopyButton } from "./CopyButton";

interface IProps {
    baseUrls: IBaseUrlRecord[];
}

export function LinksHistory(props: IProps) {
    const baseUrlsHelper = createBaseUrlsHelper(props.baseUrls);

    const { linkHistory, deleteLinkFromHistory } = useLinkHistory();

    return (
        <div>
            <h3 class="text-lg font-semibold text-zinc-300 mb-4">Recent Links</h3>
            <ClientOnly>
                <Show
                    when={linkHistory().length > 0}
                    fallback={<p class="text-zinc-500 text-sm">No links generated yet</p>}
                >
                    <div class="space-y-3 max-h-80 overflow-y-auto">
                        <For each={linkHistory()}>
                            {(item) => {
                                const baseUrl = baseUrlsHelper.getBaseUrlById(item.baseUrlId);
                                const baseUrlLabel = baseUrl?.url.host ?? "link";
                                const baseUrlHref = baseUrl?.url.href ?? "https://example.com/";
                                return (
                                    <div class="text-left p-4 border border-zinc-700 rounded-2xl flex items-center justify-between gap-2">
                                        <div class="min-w-0">
                                            <div class="w-fit font-medium text-zinc-500 hover:text-white">
                                                <a href={baseUrlHref + item.shortId} target="potoPreviewWindow">
                                                    <span>
                                                        {baseUrlLabel}
                                                        /
                                                    </span>
                                                    <span class="text-white">
                                                        {item.shortId}
                                                    </span>
                                                </a>
                                            </div>
                                            <div class="text-zinc-400 text-sm mt-1 truncate w-full">
                                                {item.targetUrl}
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <div class="text-zinc-500 text-sm text-nowrap">
                                                {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                            </div>
                                            <CopyButton text={baseUrlHref + item.shortId} />
                                            <button
                                                onClick={() => deleteLinkFromHistory(item.shortId)}
                                                class="text-zinc-400 hover:text-red-500 transition-colors"
                                                aria-label="Delete link"
                                            >
                                                <i class="bi bi-x" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </div>
                </Show>
            </ClientOnly>
        </div>
    );
}
