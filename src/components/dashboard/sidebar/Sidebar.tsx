import { ClientOnly } from "@tanstack/solid-router";
import { Show } from "solid-js";

import { NavItem } from "./NavItem";
import { SidebarLogo } from "./SidebarLogo";

interface ISidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar(props: ISidebarProps) {
    return (
        <>
            <div
                class={`
                    fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col
                    xl:static max-xl:bg-black xl:translate-x-0 xl:z-auto
                    ${props.isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
                `}
            >
                <SidebarLogo />
                <nav class="flex-1 px-4 py-4 space-y-2">
                    <ClientOnly>
                        <NavItem
                            linkOptions={{
                                to: "/dashboard",
                            }}
                            label="Dashboard"
                            icon={<i class="bi bi-speedometer2"></i>}
                        />
                        <NavItem
                            linkOptions={{
                                to: "/dashboard/links",
                            }}
                            label="Links"
                            icon={<i class="bi bi-link-45deg"></i>}
                        />
                    </ClientOnly>
                </nav>
            </div>
            <Show when={props.isOpen}>
                <div
                    class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 xl:hidden"
                    onClick={props.onClose}
                />
            </Show>
        </>
    );
}
