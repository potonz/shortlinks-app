import { useLocation } from "@tanstack/solid-router";
import { Show } from "solid-js";

interface ISidebarToggleProps {
    onClick: () => void;
}

export function SidebarToggle(props: ISidebarToggleProps) {
    const location = useLocation();

    return (
        <Show when={location().pathname.startsWith("/dashboard")}>
            <button
                type="button"
                class="p-2 text-gray-400 hover:text-white transition-colors duration-200 xl:hidden"
                aria-label="Toggle sidebar"
                onClick={props.onClick}
            >
                <i class="bi bi-list text-2xl"></i>
            </button>
        </Show>
    );
}
