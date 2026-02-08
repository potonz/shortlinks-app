import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { createSignal, Show } from "solid-js";

import { DeleteAccountModal } from "~/components/dashboard/account/DeleteAccountModal";
import { auth } from "~/libs/auth/auth";
import { authClient } from "~/libs/auth/auth-client";

const checkAuth = createServerFn()
    .handler(async () => {
        if (!(await auth.api.getSession({ headers: getRequestHeaders() }))) {
            redirect({
                to: "/login",
                throw: true,
            });
        }
    });

export const Route = createFileRoute("/dashboard/account")({
    beforeLoad() {
        return checkAuth();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const session = authClient.useSession();
    const [showDeleteModal, setShowDeleteModal] = createSignal(false);
    const navigate = Route.useNavigate();

    const handleDeleteSuccess = async () => {
        await navigate({ to: "/" });
    };

    return (
        <div class="p-4 lg:p-8">
            <div class="max-w-2xl mx-auto">
                <h1 class="text-3xl font-bold text-white mb-8">Account Settings</h1>

                <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-semibold text-white mb-4">Profile Information</h2>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-zinc-400 mb-1">Name</label>
                            <div class="text-white">{session()?.data?.user?.name || "N/A"}</div>
                        </div>

                        <div>
                            <label class="block text-sm text-zinc-400 mb-1">Email</label>
                            <div class="text-white">{session()?.data?.user?.email || "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-zinc-900 border border-red-900/50 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-2">Danger Zone</h2>
                    <p class="text-zinc-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        <i class="bi bi-trash me-2"></i>
                        Delete Account
                    </button>
                </div>
            </div>

            <Show when={showDeleteModal()}>
                <DeleteAccountModal
                    onCancel={() => setShowDeleteModal(false)}
                    onDeleted={handleDeleteSuccess}
                />
            </Show>
        </div>
    );
}
