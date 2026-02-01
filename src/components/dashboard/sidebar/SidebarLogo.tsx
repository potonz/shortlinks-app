import { Link } from "@tanstack/solid-router";

export function SidebarLogo() {
    return (
        <div class="xl:hidden p-4 border-b border-gray-800">
            <Link to="/" class="text-2xl font-bold text-white">Poto</Link>
        </div>
    );
}
