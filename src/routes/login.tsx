import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { createSignal } from "solid-js";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { authClient } from "~/libs/auth/auth-client";
import { REDIRECT_WHITELIST } from "~/utils/urls";

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
    validateSearch: z.object({
        redirect: z.optional(
            z.string().refine(val => REDIRECT_WHITELIST.some(regex => regex.test(val))).catch("/"),
        ),
    }),
    ssr: "data-only",
});

function RouteComponent() {
    const searchParams = Route.useSearch();
    const callbackURL = searchParams().redirect ?? "/dashboard";
    const [loadingProvider, setLoadingProvider] = createSignal<string | null>(null);

    const handleSignIn = (provider: typeof auth.api.signInSocial.options.metadata.$Infer.body.provider) => {
        setLoadingProvider(provider);
        authClient.signIn
            .social({
                provider,
                callbackURL,
            })
            .then(console.log)
            .catch(console.error)
            .finally(() => setLoadingProvider(null));
    };

    const spinner = (
        <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
        </div>
    );

    const button = (provider: string, icon: string, label: string) => (
        <button
            type="button"
            onClick={() => handleSignIn(provider)}
            disabled={loadingProvider() !== null}
            class="w-full py-4 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
            {loadingProvider() === provider ? spinner : <i class={icon}></i>}
            <span>{loadingProvider() === provider ? "" : label}</span>
        </button>
    );

    return (
        <div class="w-full max-w-xl text-center">
            <div>{button("google", "bi bi-google", "Sign in with Google")}</div>
            <div class="mt-4">{button("microsoft", "bi bi-microsoft", "Sign in with Microsoft")}</div>
            <div class="mt-4">{button("github", "bi bi-github", "Sign in with GitHub")}</div>
        </div>
    );
}
