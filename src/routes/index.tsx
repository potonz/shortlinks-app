import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return (
        <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">

        </div>
    );
}
