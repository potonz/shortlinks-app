import { queryOptions, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";

import { Spinner } from "~/components/common/Spinner";
import { CopyButton } from "~/components/CopyButton";
import { DeleteLinkModal } from "~/components/dashboard/links/DeleteLinkModal";
import { addNotification } from "~/components/notifications/notificationUtils";
import { fetchLinkDetails, updateLink } from "~/libs/shortlinks";
import { getBaseUrlHref, getBaseUrlLabel } from "~/utils/urls";

export const Route = createFileRoute("/dashboard/links/$id/")({
    component: EditLinkPage,
});

function linkDetailsQueryOptions(id: number) {
    return queryOptions({
        queryKey: ["link", "details", id],
        queryFn: async () => {
            const result = await fetchLinkDetails({ data: id });
            if (!result.success) {
                throw new Error(result.error || "Failed to fetch link details");
            }
            return result.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnMount: "always",
    });
}

function EditLinkPage() {
    const params = Route.useParams();
    const navigate = Route.useNavigate();
    const context = Route.useRouteContext();

    const id = () => parseInt(params().id, 10);

    const linkQuery = useQuery(() => linkDetailsQueryOptions(id()));

    const [targetUrl, setTargetUrl] = createSignal("");
    const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
    const [isUpdating, setIsUpdating] = createSignal(false);

    const handleUpdate = async () => {
        const url = targetUrl();
        if (!url) {
            addNotification("Please enter a valid URL", "error");
            return;
        }

        setIsUpdating(true);
        try {
            const result = await updateLink({
                data: {
                    shortId: linkQuery.data?.shortId ?? "",
                    targetUrl: url,
                    baseUrlId: null,
                },
            });

            if (!result.success) {
                throw new Error(result.error || "Failed to update link");
            }

            addNotification("Link updated successfully", "success");
            context().queryClient.invalidateQueries({ queryKey: ["link", "details", id()] });
            context().queryClient.invalidateQueries({ queryKey: ["links", "list"] });
        }
        catch (error) {
            addNotification(error instanceof Error ? error.message : "An error occurred while updating the link", "error");
        }
        finally {
            setIsUpdating(false);
        }
    };

    const handleBack = () => {
        navigate({ to: "/dashboard/links" });
    };

    return (
        <div class="p-4 lg:p-8">
            <div class="max-w-3xl mx-auto space-y-6">
                <div class="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Go back"
                    >
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <div>
                        <h1 class="text-3xl font-bold text-white">Edit Link</h1>
                        <p class="text-zinc-400 mt-1">Modify or delete your short link</p>
                    </div>
                </div>

                <Show
                    when={linkQuery.isSuccess && linkQuery.data}
                    fallback={(
                        <Show
                            when={linkQuery.isPending}
                            fallback={(
                                <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                                    <p class="text-red-400">
                                        {linkQuery.error?.message || "Failed to load link details. Please try again."}
                                    </p>
                                    <button
                                        onClick={() => linkQuery.refetch()}
                                        class="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        >
                            <Spinner size="md" class="py-12" />
                        </Show>
                    )}
                >
                    {(link) => {
                        if (!targetUrl()) {
                            setTargetUrl(link().originalUrl);
                        }

                        return (
                            <div class="space-y-6">
                                <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                                    <div>
                                        <label
                                            for="shortId"
                                            class="block text-sm font-medium text-zinc-400 mb-2"
                                        >
                                            Short URL
                                        </label>
                                        <div class="flex items-center gap-2">
                                            <input
                                                type="text"
                                                id="shortId"
                                                value={getBaseUrlLabel(link().baseUrlId ?? 0) + link().shortId}
                                                disabled
                                                class="flex-1 px-4 py-2 bg-zinc-950 text-zinc-500 border border-zinc-800 rounded-lg cursor-not-allowed"
                                            />
                                            <CopyButton text={getBaseUrlHref(link().baseUrlId ?? 0) + link().shortId} />
                                        </div>
                                        <p class="text-sm text-zinc-500 mt-1">
                                            The short URL cannot be changed
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            for="targetUrl"
                                            class="block text-sm font-medium text-zinc-400 mb-2"
                                        >
                                            Target URL
                                        </label>
                                        <input
                                            type="url"
                                            id="targetUrl"
                                            value={targetUrl()}
                                            onInput={e => setTargetUrl(e.currentTarget.value)}
                                            placeholder="https://example.com"
                                            class="w-full px-4 py-2 bg-zinc-950 text-white placeholder-zinc-500 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>

                                    <div class="flex items-center gap-4 text-sm text-zinc-400">
                                        <div class="flex items-center gap-2">
                                            <i class="bi bi-calendar3"></i>
                                            <span>
                                                Created:
                                                {" "}
                                                {new Date(link().createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i class="bi bi-mouse"></i>
                                            <span>
                                                {link().totalClicks}
                                                {" "}
                                                clicks
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800">
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isUpdating() || targetUrl() === link().originalUrl}
                                            class="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                        >
                                            <Show
                                                when={isUpdating()}
                                                fallback={(
                                                    <>
                                                        <i class="bi bi-check-lg"></i>
                                                        Save Changes
                                                    </>
                                                )}
                                            >
                                                <Spinner size="sm" />
                                                Saving...
                                            </Show>
                                        </button>

                                        <Link
                                            to="/dashboard/links/$id/analytics"
                                            params={{ id: id().toString() }}
                                            class="flex items-center justify-center gap-2 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                                        >
                                            <i class="bi bi-graph-up"></i>
                                            View Analytics
                                        </Link>

                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            class="flex items-center justify-center gap-2 px-6 py-2 bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 rounded-lg transition-colors sm:ml-auto"
                                        >
                                            <i class="bi bi-trash"></i>
                                            Delete Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Show>

                <Show when={showDeleteConfirm()}>
                    <DeleteLinkModal
                        id={id()}
                        onCancel={() => setShowDeleteConfirm(false)}
                        onDeleted={() => {
                            context().queryClient.invalidateQueries({ queryKey: ["links", "list"] });
                            navigate({ to: "/dashboard/links" });
                        }}
                    />
                </Show>
            </div>
        </div>
    );
}
