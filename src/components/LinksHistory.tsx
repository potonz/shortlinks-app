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
            <Show
                when={linkHistory.length > 0}
                fallback={<p class="text-zinc-500 text-sm">No links generated yet</p>}
            >
                <div class="space-y-3 max-h-80 overflow-y-auto" style={{ "scrollbar-gutter": "stable both-edges" }}>
                    <For each={linkHistory}>
                        {item => (
                            <div class="text-left p-4 border border-zinc-700 rounded-2xl flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="text-white font-medium">
                                        {props.baseUrlWithoutScheme}
                                        {item.shortId}
                                    </div>
                                    <div class="text-zinc-400 text-sm mt-1">
                                        {item.targetUrl}
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="text-zinc-500 text-sm">
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
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}
