import { ClientOnly } from "@tanstack/solid-router";
import { Show } from "solid-js";

import { useSidebar } from "~/stores/sidebarStore";

import { NavItem } from "./NavItem";
import { SidebarLogo } from "./SidebarLogo";

export function Sidebar() {
    const { isSidebarOpen, closeSidebar } = useSidebar();

    return (
        <>
            <div
                class={`
                    fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col
                    xl:static max-xl:bg-black xl:translate-x-0 xl:z-auto
                    ${isSidebarOpen() ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
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
                        <NavItem
                            linkOptions={{
                                to: "/dashboard/ga4-settings",
                            }}
                            label="GA4"
                            icon={<i class="bi bi-google"></i>}
                        />
                        <NavItem
                            linkOptions={{
                                to: "/dashboard/account",
                            }}
                            label="Account"
                            icon={<i class="bi bi-person-gear"></i>}
                        />
                    </ClientOnly>
                </nav>
            </div>
            <Show when={isSidebarOpen()}>
                <div
                    class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 xl:hidden"
                    onClick={closeSidebar}
                />
            </Show>
        </>
    );
}
