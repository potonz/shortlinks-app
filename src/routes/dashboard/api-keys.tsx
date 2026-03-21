import { queryOptions, useQuery } from "@tanstack/solid-query";
import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { createSignal, For, Show } from "solid-js";

import { Spinner } from "~/components/common/Spinner";
import { addNotification } from "~/components/notifications/notificationUtils";
import { auth } from "~/libs/auth/auth";
import { authClient } from "~/libs/auth/auth-client";

const apiKeysQueryOptions = queryOptions({
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

const checkAuth = createServerFn()
    .handler(async () => {
        if (!(await auth.api.getSession({ headers: getRequestHeaders() }))) {
            redirect({
                to: "/login",
                throw: true,
            });
        }
    });

export const Route = createFileRoute("/dashboard/api-keys")({
    beforeLoad() {
        return checkAuth();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [newKeyName, setNewKeyName] = createSignal("");
    const [isCreating, setIsCreating] = createSignal(false);
    const [revealedKey, setRevealedKey] = createSignal<string | null>(null);
    const [deletingId, setDeletingId] = createSignal<string | null>(null);

    const apiKeysQuery = useQuery(() => apiKeysQueryOptions);
    const apiKeys = () => apiKeysQuery.data ?? [];

    const handleCreate = async () => {
        const name = newKeyName().trim();
        if (!name) {
            addNotification("Please enter a name for the API key", "error");
            return;
        }

        setIsCreating(true);
        try {
            const result = await authClient.apiKey.create({
                name,
                prefix: "poto-",
            });
            if (result.error) {
                throw new Error(result.error.message);
            }
            setRevealedKey(result.data?.key ?? null);
            setNewKeyName("");
            apiKeysQuery.refetch();
            addNotification("API key created successfully", "success");
        }
        catch (error) {
            addNotification(
                error instanceof Error ? error.message : "Failed to create API key",
                "error",
            );
        }
        finally {
            setIsCreating(false);
        }
    };

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
                error instanceof Error ? error.message : "Failed to delete API key",
                "error",
            );
        }
        finally {
            setDeletingId(null);
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        addNotification("Copied to clipboard", "success");
    };

    return (
        <div class="p-4 lg:p-8">
            <div class="max-w-2xl mx-auto">
                <h1 class="text-3xl font-bold text-white mb-8">API Keys</h1>

                {/* New key revealed banner */}
                <Show when={revealedKey()}>
                    <div class="bg-green-950 border border-green-700 rounded-lg p-4 mb-6">
                        <div class="flex items-start gap-3 mb-3">
                            <i class="bi bi-check-circle-fill text-green-400 text-lg mt-0.5"></i>
                            <div>
                                <p class="text-green-300 font-semibold">API key created</p>
                                <p class="text-green-400 text-sm mt-1">
                                    Copy this key now — it won't be shown again.
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 bg-black/40 rounded px-3 py-2">
                            <code class="text-green-300 text-sm font-mono flex-1 break-all">
                                {revealedKey()}
                            </code>
                            <button
                                onClick={() => handleCopy(revealedKey()!)}
                                class="text-green-400 hover:text-green-200 transition-colors shrink-0"
                                title="Copy"
                            >
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                        <button
                            onClick={() => setRevealedKey(null)}
                            class="mt-3 text-green-500 hover:text-green-300 text-sm transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </Show>

                {/* Create new key */}
                <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-semibold text-white mb-4">Create New API Key</h2>
                    <p class="text-zinc-400 text-sm mb-4">
                        Can be used to authenticate REST API requests.
                    </p>
                    <div class="flex gap-3">
                        <input
                            type="text"
                            placeholder="Key name (e.g. My App)"
                            value={newKeyName()}
                            onInput={e => setNewKeyName(e.currentTarget.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            disabled={isCreating()}
                            class="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={isCreating() || !newKeyName().trim()}
                            class="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                        >
                            {isCreating() ? <Spinner size="sm" /> : <i class="bi bi-plus-lg"></i>}
                            {isCreating() ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>

                {/* Existing keys */}
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
                                            <div class="text-zinc-500 text-xs shrink-0">
                                                {new Date(key.createdAt).toLocaleDateString()}
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
            </div>
        </div>
    );
}
