import { Link } from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";

import { DeleteLinkModal } from "./DeleteLinkModal";

interface ILinkActionsProps {
    id: number;
    shortId: string;
    onDeleted: () => Promise<void>;
}

export function LinkActions(props: ILinkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

    return (
        <div class="flex items-center justify-end gap-2">
            <Link
                to="/dashboard/links/$id"
                params={{ id: props.id.toString() }}
                class="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Edit link"
            >
                <i class="bi bi-pencil"></i>
            </Link>
            <Link
                to="/dashboard/links/$id/analytics"
                params={{ id: props.id.toString() }}
                class="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-lg transition-colors"
                title="View analytics"
            >
                <i class="bi bi-graph-up"></i>
            </Link>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                class="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                title="Delete link"
            >
                <i class="bi bi-trash"></i>
            </button>

            <Show when={showDeleteConfirm()}>
                <DeleteLinkModal
                    id={props.id}
                    onCancel={() => setShowDeleteConfirm(false)}
                    onDeleted={props.onDeleted}
                />
            </Show>
        </div>
    );
}
