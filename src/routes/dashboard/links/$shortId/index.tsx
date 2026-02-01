import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/dashboard/links/$shortId/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/dashboard/links/$shortId/"!</div>;
}
