import { useQueryClient } from "@tanstack/solid-query";
import { createSignal } from "solid-js";

import { Spinner } from "~/components/common/Spinner";
import { addNotification } from "~/components/notifications/notificationUtils";
import { deleteLink } from "~/libs/links";
import { useLinkHistory } from "~/stores/linkHistoryStore";

interface DeleteLinkModalProps {
    shortId: string;
    onCancel: () => void;
    onDeleted: () => void;
}

export function DeleteLinkModal(props: DeleteLinkModalProps) {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = createSignal(false);
    const { deleteLinkFromHistory } = useLinkHistory();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteLink({ data: props.shortId });
            queryClient.invalidateQueries({ queryKey: ["links", "list"] });
            deleteLinkFromHistory(props.shortId);

            if (!result.success) {
                throw new Error(result.error || "Failed to delete link");
            }

            addNotification("Link deleted successfully", "success");
            props.onDeleted();
        }
        catch (error) {
            addNotification(error instanceof Error ? error.message : "An error occurred while deleting the link", "error");
        }
        finally {
            setIsDeleting(false);
        }
    };

    return (
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md mx-4">
                <h3 class="text-lg font-semibold text-white mb-2">Delete Link</h3>
                <p class="text-zinc-400 mb-6">
                    Are you sure you want to delete this link? This action cannot be undone and all analytics data will be lost.
                </p>
                <div class="flex gap-3 justify-end">
                    <button
                        onClick={props.onCancel}
                        disabled={isDeleting()}
                        class="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting()}
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting()
                            ? <Spinner size="sm" />
                            : <i class="bi bi-trash"></i>}
                        {isDeleting() ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
