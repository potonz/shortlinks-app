import { createSignal } from "solid-js";

export const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);

export function openSidebar() {
    setIsSidebarOpen(true);
}

export function closeSidebar() {
    setIsSidebarOpen(false);
}

export function toggleSidebar() {
    setIsSidebarOpen(prev => !prev);
}
