import { createFileRoute, Link } from "@tanstack/solid-router";

import { LinksTable } from "~/components/dashboard/links/LinksTable";

export const Route = createFileRoute("/dashboard/links/")({
    component: LinksPage,
});

function LinksPage() {
    const ctx = Route.useRouteContext();

    return (
        <div class="p-4 lg:p-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-white">Links</h1>
                        <p class="text-zinc-400 mt-1">Manage and track your short links</p>
                    </div>
                    <Link to="/">
                        <button
                            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <i class="bi bi-plus-lg"></i>
                            Create New Link
                        </button>
                    </Link>
                </div>

                <LinksTable baseUrls={ctx().baseUrls} />
            </div>
        </div>
    );
}
