import { Link } from "@tanstack/solid-router";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";

import { authClient } from "~/libs/auth/auth-client";

export function Navbar() {
    let dropdownRef!: HTMLDivElement;
    const [dropdownOpen, setDropdownOpen] = createSignal(false);
    const [session, setSession] = createSignal<null | typeof authClient.useSession.value>(null);
    authClient.useSession.subscribe(setSession);

    const handleSignOut = async () => {
        await authClient.signOut();
    };

    createEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <div class="flex justify-center px-4">
            <nav class="w-full max-w-xl my-4 bg-black/50 backdrop-blur-md rounded-md flex items-center justify-between">
                {/* Logo */}
                <Link to="/" class="text-4xl font-bold text-white">Poto</Link>

                <div class="ml-auto flex items-center space-x-2 h-full">
                    <a
                        href="https://github.com/potonz"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-white hover:text-zinc-300 mr-2"
                    >
                        <i class="bi bi-github text-2xl"></i>
                    </a>
                    <div class="w-px h-full bg-zinc-500 mx-4"></div>
                    <Switch>
                        <Match when={session()?.isPending}>
                            <div class="animate-pulse">
                                <div class="w-40 h-2 rounded bg-zinc-800"></div>
                            </div>
                        </Match>
                        <Match when={!session()?.data?.session.id}>
                            <Link
                                to="/login"
                                class="flex gap-2 bg-white text-black px-3 py-1 rounded-md hover:bg-zinc-100"
                            >
                                Sign in
                            </Link>
                        </Match>
                        <Match when={session()?.data?.session}>
                            <div class="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                    class="flex gap-2 px-3 py-2 rounded hover:bg-zinc-800"
                                >
                                    <i class="bi bi-person" />
                                    {session()?.data?.user.name}
                                </button>
                                <Show when={dropdownOpen()}>
                                    <div class="absolute right-0 mt-2 w-44 bg-zinc-800 hover:bg-zinc-700 rounded-md shadow-lg shadow-zinc-900 z-10">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleSignOut();
                                                setDropdownOpen(false);
                                            }}
                                            class="w-full text-right px-4 py-2"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </Show>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </nav>
        </div>
    );
}
