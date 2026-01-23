import { Link } from "@tanstack/solid-router";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";

import { authClient } from "~/libs/auth/auth-client";

import styles from "./Navbar.module.css";

export function Navbar() {
    let dropdownRef!: HTMLDivElement;
    const [dropdownOpen, setDropdownOpen] = createSignal(false);
    const session = authClient.useSession();

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
                                <div class="w-28 h-2 rounded bg-zinc-800"></div>
                            </div>
                        </Match>
                        <Match when={!session()?.data?.session.id}>
                            <Link to="/login" class="flex gap-2 bg-white text-black px-3 py-1 rounded-md hover:bg-zinc-100">
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
                                    <div class="absolute flex flex-col justify-end gap-1 rounded p-1 right-0 mt-2 bg-zinc-800 shadow-lg shadow-zinc-900 z-10">
                                        <Link to="/dashboard" class={styles["user-dropdown-item"]}>My Dashboard</Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleSignOut();
                                                setDropdownOpen(false);
                                            }}
                                            class={styles["user-dropdown-item"]}
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
