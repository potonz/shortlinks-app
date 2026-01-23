import { createFileRoute } from "@tanstack/solid-router";

import { authClient } from "~/libs/auth/auth-client";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const handleSignIn = (provider: string) => {
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
