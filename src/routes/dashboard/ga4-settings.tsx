import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { createResource, createSignal, For, Show } from "solid-js";

import { auth } from "~/libs/auth/auth";
import { deleteGa4Config } from "~/libs/ga4/deleteGa4Config.functions";
import { getUserGa4Configs } from "~/libs/ga4/getUserGa4Configs.functions";
import { saveGa4Config } from "~/libs/ga4/saveGa4Config.functions";
import { testGa4Connection } from "~/libs/ga4/testGa4Connection.functions";
import type { TGA4Config } from "~/libs/ga4/types";

const checkAuth = createServerFn()
    .handler(async () => {
        if (!(await auth.api.getSession({ headers: getRequestHeaders() }))) {
            redirect({
                to: "/login",
                throw: true,
            });
        }
    });

export const Route = createFileRoute("/dashboard/ga4-settings")({
    beforeLoad() {
        return checkAuth();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [configs, { refetch } = {}] = createResource(async () => {
        return await getUserGa4Configs();
    });
    const [isFormOpen, setIsFormOpen] = createSignal(false);
    const [editingConfig, setEditingConfig] = createSignal<TGA4Config | null>(null);
    const [formData, setFormData] = createSignal({
        name: "",
        measurementId: "",
        apiSecret: "",
        enabled: true,
    });
    const [isTesting, setIsTesting] = createSignal(false);
    const [isSaving, setIsSaving] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [success, setSuccess] = createSignal<string | null>(null);

    const openAddForm = () => {
        setEditingConfig(null);
        setFormData({ name: "", measurementId: "", apiSecret: "", enabled: true });
        setError(null);
        setSuccess(null);
        setIsFormOpen(true);
    };

    const openEditForm = (config: TGA4Config) => {
        setEditingConfig(config);
        setFormData({
            name: config.name,
            measurementId: config.measurement_id,
            apiSecret: "",
            enabled: config.enabled,
        });
        setError(null);
        setSuccess(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingConfig(null);
        setFormData({ name: "", measurementId: "", apiSecret: "", enabled: true });
        setError(null);
        setSuccess(null);
    };

    const handleTestConnection = async () => {
        const data = formData();
        if (!data.measurementId || !data.apiSecret) {
            setError("Please enter Measurement ID and API Secret");
            return;
        }

        setIsTesting(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await testGa4Connection({
                data: {
                    measurementId: data.measurementId,
                    apiSecret: data.apiSecret,
                },
            });

            if (result.success) {
                setSuccess("Connection successful!");
            }
            else {
                setError(result.error || "Connection failed");
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
        }
        finally {
            setIsTesting(false);
        }
    };

    const handleSave = async () => {
        const data = formData();
        if (!data.name || !data.measurementId || !data.apiSecret) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await saveGa4Config({
                data: {
                    name: data.name,
                    measurementId: data.measurementId,
                    apiSecret: data.apiSecret,
                    enabled: data.enabled,
                },
            });

            if (result.success) {
                setSuccess(editingConfig() ? "Config updated!" : "Config saved!");
                closeForm();
                refetch?.();
            }
            else {
                setError(result.error || "Failed to save config");
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save config");
        }
        finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (configId: number) => {
        if (!confirm("Are you sure you want to delete this configuration?")) {
            return;
        }

        try {
            const result = await deleteGa4Config({
                data: { configId },
            });
            if (result.success) {
                refetch?.();
            }
            else {
                setError(result.error || "Failed to delete config");
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete config");
        }
    };

    const handleToggleEnabled = async (config: TGA4Config) => {
        try {
            const result = await saveGa4Config({
                data: {
                    name: config.name,
                    measurementId: config.measurement_id,
                    apiSecret: "",
                    enabled: !config.enabled,
                },
            });

            if (result.success) {
                refetch?.();
            }
        }
        catch (err) {
            console.error("Failed to toggle config:", err);
        }
    };

    return (
        <div class="p-4 lg:p-8">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-white">GA4 Configurations</h1>
                        <p class="text-zinc-400 mt-1">
                            Manage your Google Analytics 4 properties for tracking link clicks
                        </p>
                    </div>
                    <Show when={!isFormOpen()}>
                        <button
                            onClick={openAddForm}
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <i class="bi bi-plus-lg"></i>
                            Add Configuration
                        </button>
                    </Show>
                </div>

                <Show when={error()}>
                    <div class="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error()}
                    </div>
                </Show>

                <Show when={success()}>
                    <div class="bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-lg mb-6">
                        {success()}
                    </div>
                </Show>

                <Show when={isFormOpen()}>
                    <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                        <h2 class="text-xl font-semibold text-white mb-6">
                            {editingConfig() ? "Edit Configuration" : "New Configuration"}
                        </h2>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm text-zinc-400 mb-1">
                                    Name
                                    {" "}
                                    <span class="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData().name}
                                    onInput={e => setFormData({ ...formData(), name: e.currentTarget.value })}
                                    placeholder="e.g., Production, Staging"
                                    class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm text-zinc-400 mb-1">
                                    Measurement ID
                                    {" "}
                                    <span class="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData().measurementId}
                                    onInput={e => setFormData({ ...formData(), measurementId: e.currentTarget.value })}
                                    placeholder="G-XXXXXXXXXX"
                                    class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm text-zinc-400 mb-1">
                                    API Secret
                                    {" "}
                                    <span class="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData().apiSecret}
                                    onInput={e => setFormData({ ...formData(), apiSecret: e.currentTarget.value })}
                                    placeholder={editingConfig() ? "Leave blank to keep current secret" : "Enter API secret"}
                                    class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                                <p class="text-xs text-zinc-500 mt-1">
                                    Create in GA4 under Admin &gt; Data Streams &gt; your stream &gt; Measurement Protocol API secrets
                                </p>
                            </div>

                            <div class="flex items-center gap-3">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTesting() || !formData().measurementId || !formData().apiSecret}
                                    class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTesting() ? "Testing..." : "Test Connection"}
                                </button>
                            </div>

                            <div class="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving() || !formData().name || !formData().measurementId || !formData().apiSecret}
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving() ? "Saving..." : editingConfig() ? "Update" : "Save"}
                                </button>
                                <button
                                    onClick={closeForm}
                                    class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Show>

                <Show when={!isFormOpen()}>
                    <Show when={configs()?.success && configs()?.data?.length === 0}>
                        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                            <i class="bi bi-google text-4xl text-zinc-500 mb-4 block"></i>
                            <h3 class="text-xl font-semibold text-white mb-2">No GA4 Configurations</h3>
                            <p class="text-zinc-400 mb-6">
                                Add a Google Analytics 4 configuration to track link clicks in your analytics property.
                            </p>
                            <button
                                onClick={openAddForm}
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Add Your First Configuration
                            </button>
                        </div>
                    </Show>

                    <Show when={configs()?.success && configs()?.data && configs()!.data!.length > 0}>
                        <div class="space-y-4">
                            <For each={configs()?.data}>
                                {config => (
                                    <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                                        <div class="flex items-center justify-between">
                                            <div class="flex-1">
                                                <div class="flex items-center gap-3">
                                                    <h3 class="text-lg font-semibold text-white">{config.name}</h3>
                                                    <Show when={!config.enabled}>
                                                        <span class="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">
                                                            Disabled
                                                        </span>
                                                    </Show>
                                                </div>
                                                <p class="text-zinc-400 text-sm mt-1">
                                                    {config.measurement_id}
                                                </p>
                                                <p class="text-zinc-500 text-xs mt-1">
                                                    Last updated:
                                                    {" "}
                                                    {new Date(config.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div class="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleEnabled(config)}
                                                    class={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                                                        config.enabled
                                                            ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                                                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                                                    }`}
                                                >
                                                    {config.enabled ? "Enabled" : "Disabled"}
                                                </button>
                                                <button
                                                    onClick={() => openEditForm(config)}
                                                    class="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
                                                >
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(config.id)}
                                                    class="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm"
                                                >
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </Show>
            </div>
        </div>
    );
}
