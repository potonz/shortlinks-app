import { Link } from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";

import { addNotification } from "~/components/notifications/notificationUtils";

interface ILinkActionsProps {
    shortId: string;
    onDelete: () => Promise<void>;
    isDeleting: boolean;
}

export function LinkActions(props: ILinkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

    const handleDelete = async () => {
        try {
            await props.onDelete();
        }
        catch {
            addNotification("Failed to delete link", "error");
        }
        finally {
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div class="flex items-center justify-end gap-2">
            <Link
                to="/dashboard/links/$shortId"
                params={{ shortId: props.shortId }}
                class="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Edit link"
            >
                <i class="bi bi-pencil"></i>
            </Link>
            <Link
                to="/dashboard/links/$shortId/analytics"
                params={{ shortId: props.shortId }}
                class="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="View analytics"
            >
                <i class="bi bi-graph-up"></i>
            </Link>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={props.isDeleting}
                class="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                title="Delete link"
            >
                <i class="bi bi-trash"></i>
            </button>

            <Show when={showDeleteConfirm()}>
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md mx-4">
                        <h3 class="text-lg font-semibold text-white mb-2">Delete Link</h3>
                        <p class="text-zinc-400 mb-6">
                            Are you sure you want to delete this link? This action cannot be undone.
                        </p>
                        <div class="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={props.isDeleting}
                                class="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={props.isDeleting}
                                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {props.isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
}
