import { queryOptions, useQuery } from "@tanstack/solid-query";
import { formatDistanceToNow } from "date-fns";
import { createSignal, For, Show } from "solid-js";

import { Spinner } from "~/components/common/Spinner";
import { addNotification } from "~/components/notifications/notificationUtils";
import { authClient } from "~/libs/auth/auth-client";

export const apiKeysQueryOptions = queryOptions({
    queryKey: ["api-keys", "list"],
    queryFn: async () => {
        const result = await authClient.apiKey.list();
        if (result.error) {
            throw new Error(result.error.message);
        }
        return result.data;
    },
    staleTime: 5 * 60 * 1000,
});

export function ApiKeysList() {
    const [deletingId, setDeletingId] = createSignal<string | null>(null);

    const apiKeysQuery = useQuery(() => apiKeysQueryOptions);
    const apiKeys = () => apiKeysQuery.data?.apiKeys ?? [];

    const handleDelete = async (keyId: string) => {
        setDeletingId(keyId);
        try {
            const result = await authClient.apiKey.delete({ keyId });
            if (result.error) {
                throw new Error(result.error.message);
            }
            apiKeysQuery.refetch();
            addNotification("API key deleted", "success");
        }
        catch (error) {
            addNotification(
                error instanceof Error
                    ? error.message
                    : "Failed to delete API key",
                "error",
            );
        }
        finally {
            setDeletingId(null);
        }
    };

    return (
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Your API Keys</h2>

            <Show when={apiKeysQuery.isPending}>
                <div class="flex justify-center py-8">
                    <Spinner />
                </div>
            </Show>

            <Show when={apiKeysQuery.isError}>
                <p class="text-red-400 text-sm">Failed to load API keys.</p>
            </Show>

            <Show when={!apiKeysQuery.isPending && !apiKeysQuery.isError}>
                <Show
                    when={apiKeys().length > 0}
                    fallback={(
                        <p class="text-zinc-500 text-sm text-center py-6">
                            No API keys yet. Create one above.
                        </p>
                    )}
                >
                    <div class="space-y-3">
                        <For each={apiKeys()}>
                            {key => (
                                <div class="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3">
                                    <i class="bi bi-key text-zinc-400 text-lg shrink-0"></i>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-white text-sm font-medium truncate">
                                            {key.name ?? "Unnamed key"}
                                        </div>
                                        <div class="text-zinc-500 text-xs mt-0.5 font-mono">
                                            {key.start ?? ""}
                                            ••••••••
                                        </div>
                                    </div>
                                    <div class="text-zinc-500 text-xs shrink-0 text-right">
                                        <div>
                                            {new Date(key.createdAt).toLocaleDateString()}
                                        </div>
                                        <Show when={key.lastRequest}>
                                            <div class="text-zinc-600">
                                                {"Last used "}
                                                {formatDistanceToNow(
                                                    new Date(key.lastRequest!),
                                                    { addSuffix: true },
                                                )}
                                            </div>
                                        </Show>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(key.id)}
                                        disabled={deletingId() === key.id}
                                        class="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
                                        title="Delete key"
                                    >
                                        {deletingId() === key.id
                                            ? <Spinner size="sm" />
                                            : <i class="bi bi-trash"></i>}
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </Show>
        </div>
    );
}
