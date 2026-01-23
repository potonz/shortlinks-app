import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_dashboard/app"!</div>;
}
