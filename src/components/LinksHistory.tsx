import { ClientOnly, Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";

import { deleteLinkFromHistory, linkHistory } from "../stores/linkHistoryStore";
import { CopyButton } from "./CopyButton";

interface IProps {
    baseUrlWithoutScheme: string;
    fullBaseHref: string;
}

export function LinksHistory(props: IProps) {
    return (
        <div>
            <h3 class="text-lg font-semibold text-zinc-300 mb-4">Recent Links</h3>
            <ClientOnly>
                <Show
                    when={linkHistory.length > 0}
                    fallback={<p class="text-zinc-500 text-sm">No links generated yet</p>}
                >
                    <div class="space-y-3 max-h-80 overflow-y-auto">
                        <For each={linkHistory}>
                            {item => (
                                <div class="text-left p-4 border border-zinc-700 rounded-2xl flex items-center justify-between gap-2">
                                    <div class="min-w-0">
                                        <div class="font-medium">
                                            <span class="text-zinc-500">
                                                {props.baseUrlWithoutScheme}
                                            </span>
                                            <span class="text-white">
                                                {item.shortId}
                                            </span>
                                        </div>
                                        <div class="text-zinc-400 text-sm mt-1 truncate w-full">
                                            {item.targetUrl}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="text-zinc-500 text-sm text-nowrap">
                                            {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                        </div>
                                        <CopyButton text={props.fullBaseHref + item.shortId} />
                                        <button
                                            onClick={() => deleteLinkFromHistory(item.shortId)}
                                            class="text-zinc-400 hover:text-red-500 transition-colors"
                                            aria-label="Delete link"
                                        >
                                            <i class="bi bi-trash" />
                                        </button>
                                        <a href={props.fullBaseHref + item.shortId} class="text-zinc-400 hover:text-white" target="potoPreviewWindow">
                                            <i class="bi bi-box-arrow-up-right"></i>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </ClientOnly>
        </div>
    );
}
