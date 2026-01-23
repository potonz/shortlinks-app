import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

import { auth } from "~/libs/auth/auth";
import { authClient } from "~/libs/auth/auth-client";

const checkLoggedIn = createServerFn()
    .handler(async () => {
        if (await auth.api.getSession({ headers: getRequestHeaders() })) {
            redirect({
                to: "/dashboard",
                throw: true,
            });
        }
    });

export const Route = createFileRoute("/login")({
    beforeLoad() {
        return checkLoggedIn();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const handleSignIn = (provider: typeof auth.api.signInSocial.options.metadata.$Infer.body.provider) => {
        authClient.signIn.social({ provider }).then(console.log).catch(console.error);
    };

    return (
        <div class="w-full max-w-xl text-center">
            <div>
                <button
                    type="button"
                    onClick={() => handleSignIn("google")}
                    class="w-full py-4 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer flex items-center justify-center gap-2"
                >
                    <i class="bi bi-google"></i>
                    <span>Sign in with Google</span>
                </button>
            </div>
            <div class="mt-4">
                <button
                    type="button"
                    onClick={() => handleSignIn("microsoft")}
                    class="w-full py-4 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer flex items-center justify-center gap-2"
                >
                    <i class="bi bi-microsoft"></i>
                    <span>Sign in with Microsoft</span>
                </button>
            </div>
            <div class="mt-4">
                <button
                    type="button"
                    onClick={() => handleSignIn("github")}
                    class="w-full py-4 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer flex items-center justify-center gap-2"
                >
                    <i class="bi bi-github"></i>
                    <span>Sign in with GitHub</span>
                </button>
            </div>
        </div>
    );
}
