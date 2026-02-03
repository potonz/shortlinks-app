import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";

import { Spinner } from "~/components/common/Spinner";
import { CopyButton } from "~/components/CopyButton";
import { addNotification } from "~/components/notifications/notificationUtils";
import { deleteLink } from "~/libs/links";
import { useLinkHistory } from "~/stores/linkHistoryStore";
import { baseUrlWithoutScheme, fullBaseHref } from "~/utils/urls";

import { LinkActions } from "./LinkActions";
import { createLinksQuery } from "./query";

type SortField = "createdAt" | "totalClicks" | "originalUrl";
type SortDirection = "asc" | "desc";

const pageSize = 10;

export function LinksTable() {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = createSignal(1);
    const [searchQuery, setSearchQuery] = createSignal("");
    const [sortField, setSortField] = createSignal<SortField>("createdAt");
    const [sortDirection, setSortDirection] = createSignal<SortDirection>("desc");
    const [deletingId, setDeletingId] = createSignal<string | null>(null);
    const { deleteLinkFromHistory } = useLinkHistory();

    const linksQuery = useQuery(() => createLinksQuery(currentPage(), pageSize));

    const links = () => linksQuery.data?.data ?? [];
    const pagination = () => linksQuery.data?.pagination;
    const isLoading = () => linksQuery.isPending;

    const filteredLinks = () => {
        const query = searchQuery().toLowerCase();
        return links().filter(link =>
            link.shortId.toLowerCase().includes(query)
            || link.originalUrl.toLowerCase().includes(query)
            || (baseUrlWithoutScheme + link.shortId).toLowerCase().includes(query),
        );
    };

    const sortedLinks = () => {
        const field = sortField();
        const direction = sortDirection();

        return [...filteredLinks()].sort((a, b) => {
            let comparison = 0;

            switch (field) {
                case "createdAt":
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case "totalClicks":
                    comparison = a.totalClicks - b.totalClicks;
                    break;
                case "originalUrl":
                    comparison = a.originalUrl.localeCompare(b.originalUrl);
                    break;
            }

            return direction === "asc" ? comparison : -comparison;
        });
    };

    const handleSort = (field: SortField) => {
        if (sortField() === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        }
        else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const handleDelete = async (shortId: string) => {
        setDeletingId(shortId);
        try {
            const result = await deleteLink({ data: shortId });

            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ["links", "list"] });
                deleteLinkFromHistory(shortId);
                addNotification("Link deleted successfully", "success");
            }
            else {
                addNotification(result.error || "Failed to delete link", "error");
            }
        }
        finally {
            setDeletingId(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateUrl = (url: string, maxLength = 50) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + "...";
    };

    return (
        <div class="space-y-4">
            <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div class="relative flex-1 max-w-md">
                    <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"></i>
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={searchQuery()}
                        onInput={(e) => {
                            setSearchQuery(e.currentTarget.value);
                            setCurrentPage(1);
                        }}
                        class="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                </div>
                <div class="text-zinc-400 text-sm">
                    {pagination()?.total ?? 0}
                    {" "}
                    link
                    {(pagination()?.total ?? 0) !== 1 ? "s" : ""}
                </div>
            </div>

            <Show when={isLoading()}>
                <Spinner size="md" class="py-12" />
            </Show>

            <Show when={!isLoading() && links().length === 0}>
                <div class="text-center py-12 bg-zinc-900 rounded-lg">
                    <i class="bi bi-link-45deg text-4xl text-zinc-600 mb-4"></i>
                    <p class="text-zinc-400">No links found. Create your first short link!</p>
                </div>
            </Show>

            <Show when={!isLoading() && links().length > 0}>
                <div class="rounded-lg border border-zinc-800 overflow-hidden">
                    {/* Desktop Layout - Single Grid */}
                    <div class="hidden md:grid grid-cols-[minmax(200px,2fr)_minmax(250px,3fr)_auto_auto_auto]">
                        {/* Header Row */}
                        <div class="col-span-5 grid grid-cols-subgrid sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
                            <div class="px-4 py-3 text-zinc-400 font-medium text-sm">
                                <button
                                    onClick={() => handleSort("originalUrl")}
                                    class="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    Short URL
                                    {sortField() === "originalUrl" && (
                                        <i class={`bi bi-chevron-${sortDirection() === "asc" ? "up" : "down"}`}></i>
                                    )}
                                </button>
                            </div>
                            <div class="px-4 py-3 text-zinc-400 font-medium text-sm">
                                Original URL
                            </div>
                            <div class="px-4 py-3 text-zinc-400 font-medium text-sm">
                                <button
                                    onClick={() => handleSort("totalClicks")}
                                    class="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    Clicks
                                    {sortField() === "totalClicks" && (
                                        <i class={`bi bi-chevron-${sortDirection() === "asc" ? "up" : "down"}`}></i>
                                    )}
                                </button>
                            </div>
                            <div class="px-4 py-3 text-zinc-400 font-medium text-sm">
                                <button
                                    onClick={() => handleSort("createdAt")}
                                    class="flex items-center gap-2 hover:text-white transition-colors"
                                >
                                    Created
                                    {sortField() === "createdAt" && (
                                        <i class={`bi bi-chevron-${sortDirection() === "asc" ? "up" : "down"}`}></i>
                                    )}
                                </button>
                            </div>
                            <div class="px-4 py-3 text-zinc-400 font-medium text-sm text-right">
                                Actions
                            </div>
                        </div>

                        {/* Body Rows */}
                        <For each={sortedLinks()}>
                            {link => (
                                <div class="col-span-5 grid grid-cols-subgrid hover:bg-zinc-800/50 transition-colors items-center border-b border-zinc-800 last:border-b-0 relative">
                                    <Show when={deletingId() === link.shortId}>
                                        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        </div>
                                    </Show>
                                    {/* Short URL */}
                                    <div class="px-4 py-3 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <a
                                                href={fullBaseHref + link.shortId}
                                                target="potoPreviewWindow"
                                                class="font-medium truncate text-zinc-500 hover:text-white"
                                            >
                                                <span>{baseUrlWithoutScheme}</span>
                                                <span class="text-white">{link.shortId}</span>
                                            </a>
                                            <CopyButton text={fullBaseHref + link.shortId} />
                                        </div>
                                    </div>

                                    {/* Original URL */}
                                    <div class="px-4 py-3 min-w-0">
                                        <a
                                            href={link.originalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-zinc-400 hover:text-white truncate block"
                                            title={link.originalUrl}
                                        >
                                            {truncateUrl(link.originalUrl, 80)}
                                        </a>
                                    </div>

                                    {/* Clicks */}
                                    <div class="px-4 py-3 text-white">{link.totalClicks}</div>

                                    {/* Created */}
                                    <div class="px-4 py-3 text-zinc-400 text-sm">{formatDate(link.createdAt)}</div>

                                    {/* Actions */}
                                    <div class="px-4 py-3">
                                        <LinkActions
                                            shortId={link.shortId}
                                            onDelete={() => handleDelete(link.shortId)}
                                            isDeleting={deletingId() === link.shortId}
                                        />
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>

                    {/* Mobile Card Layout */}
                    <div class="md:hidden divide-y divide-zinc-800">
                        <For each={sortedLinks()}>
                            {link => (
                                <div class="p-4 space-y-3 bg-zinc-900/30 hover:bg-zinc-800/30 transition-colors relative">
                                    <Show when={deletingId() === link.shortId}>
                                        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        </div>
                                    </Show>
                                    {/* Short URL */}
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2 min-w-0 flex-1">
                                            <a
                                                href={fullBaseHref + link.shortId}
                                                target="potoPreviewWindow"
                                                class="font-medium truncate text-zinc-500 hover:text-white"
                                            >
                                                <span>{baseUrlWithoutScheme}</span>
                                                <span class="text-white">{link.shortId}</span>
                                            </a>
                                            <CopyButton text={fullBaseHref + link.shortId} />
                                        </div>
                                        <div class="ml-2">
                                            <LinkActions
                                                shortId={link.shortId}
                                                onDelete={() => handleDelete(link.shortId)}
                                                isDeleting={deletingId() === link.shortId}
                                            />
                                        </div>
                                    </div>

                                    {/* Original URL */}
                                    <div>
                                        <div class="text-zinc-500 text-xs mb-1">Destination</div>
                                        <a
                                            href={link.originalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-zinc-300 hover:text-white text-sm truncate block"
                                            title={link.originalUrl}
                                        >
                                            {truncateUrl(link.originalUrl, 60)}
                                        </a>
                                    </div>

                                    {/* Stats Row */}
                                    <div class="flex items-center gap-4 text-sm">
                                        <div>
                                            <span class="text-zinc-500">Clicks: </span>
                                            <span class="text-white">{link.totalClicks}</span>
                                        </div>
                                        <div class="text-zinc-500">|</div>
                                        <div class="text-zinc-400">
                                            {formatDate(link.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                <Show when={(pagination()?.totalPages ?? 0) > 1}>
                    <div class="flex justify-center gap-2 pt-4">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage() - 1))}
                            disabled={currentPage() === 1}
                            class="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                        >
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <span class="px-4 py-2 text-zinc-400">
                            Page
                            {" "}
                            {currentPage()}
                            {" "}
                            of
                            {" "}
                            {pagination()?.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(Math.min(pagination()?.totalPages ?? 1, currentPage() + 1))}
                            disabled={currentPage() === (pagination()?.totalPages ?? 1)}
                            class="px-3 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                        >
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </Show>
            </Show>
        </div>
    );
}
