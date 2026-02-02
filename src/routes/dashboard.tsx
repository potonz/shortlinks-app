import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { Sidebar } from "~/components/dashboard/sidebar/Sidebar";
import { auth } from "~/libs/auth/auth";

const checkLoggedIn = createServerFn()
    .inputValidator(z.string().min(0))
    .handler(async ({ data: href }) => {
        if (!(await auth.api.getSession({ headers: getRequestHeaders() }))) {
            redirect({
                to: "/login",
                search: {
                    redirect: href,
                },
                throw: true,
            });
        }
    });

export const Route = createFileRoute("/dashboard")({
    beforeLoad({ location }) {
        return checkLoggedIn({ data: location.href });
    },
    component: DashboardLayout,
});

function DashboardLayout() {
    return (
        <div class="grow self-stretch flex">
            <Sidebar />
            <div class="flex-1 flex flex-col xl:mx-32 max-w-full">
                <div class="">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
