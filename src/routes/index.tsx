import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, Show } from "solid-js";
import { z } from "zod/mini";
import { createShortLink } from "../libs/shortlinks/createShortLink";
import { createIsomorphicFn } from "@tanstack/solid-start";

export const Route = createFileRoute("/")({
    head: () => ({
        scripts: [
            { src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", async: true },
        ],
        links: [
            { rel: "preconnect", href: "https://challenges.cloudflare.com" },
        ],
    }),
    component: App,
});

const baseUrl = createIsomorphicFn()
    .server(() => new URL(process.env.VITE_SHORT_LINK_BASE_URL!).href.replace(/\/*$/, "/"))
    .client(() => new URL(import.meta.env.VITE_SHORT_LINK_BASE_URL!).href.replace(/\/*$/, "/"));

function App() {
    const [url, setUrl] = createSignal("");
    let captchaContainerRef: HTMLDivElement | undefined;
    let captchaToken = "";
    const isInputUrlValid = () => z.httpUrl().safeParse(url());
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [shortIdGenerated, setShortIdGenerated] = createSignal("zxc");

    function onInput(event: Event & { currentTarget: HTMLInputElement }) {
        setUrl(event.currentTarget.value);
    }

    function onBlur(event: Event & { currentTarget: HTMLInputElement }) {
        let value = event.currentTarget.value.trim();

        // If the user doesn't input a schema, we default to https
        if (value.length > 0 && !/^[a-zA-Z]+:\/\//.test(value)) {
            value = "https://" + value;
        }

        setUrl(value);
    }

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        if (!url()) return;
        if (!captchaToken) return;

        setIsSubmitting(true);

        createShortLink({
            data: {
                url: url(),
                captchaToken: captchaToken,
            },
        }).then((shortId) => {
            if (shortId) {
                setUrl("");
                setShortIdGenerated(shortId);
            }
            else {
                console.error("Can't generate shit");
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    createEffect(() => {
        addEventListener("load", () => {
            turnstile.render(captchaContainerRef!, {
                "sitekey": import.meta.env.VITE_CF_TURNSTILE_SITE_KEY,
                "action": "generate_short_link",
                "callback": (token: string) => {
                    captchaToken = token;
                },
                "theme": "dark",
                "expired-callback": () => {
                    captchaToken = "";
                },
            });
        }, { once: true });
    });

    return (
        <div class="w-full max-w-md text-center z-10">
            <form onSubmit={handleSubmit} class="space-y-6">
                <div>
                    <input
                        type="url"
                        placeholder="Enter URL"
                        value={url()}
                        onInput={onInput}
                        onBlur={onBlur}
                        required
                        class="w-full px-6 py-4 bg-zinc-950 text-center text-white placeholder-zinc-500 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all animation-duration-300"
                    />
                </div>

                <div id="turnstile-container" ref={captchaContainerRef}></div>

                <button
                    type="submit"
                    class="w-full py-4 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-950 disabled:text-zinc-700"
                    disabled={!isInputUrlValid().success}
                >
                    <span class="flex items-center justify-center gap-2">
                        Squeeze
                    </span>
                </button>
            </form>

            <Show when={isSubmitting()}>
                <div class="mt-12 flex gap-2 justify-center opacity-40">
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
                </div>
            </Show>
            <Show when={shortIdGenerated()}>
                {shortId => (
                    <div class="mt-12 p-4 border border-zinc-500 rounded-2xl flex">
                        <div class="grow text-left">
                            <span class="text-zinc-500">{baseUrl()}</span>
                            <span class="text-white">{shortId()}</span>
                        </div>
                        <div>
                            <button>Copy</button>
                        </div>
                    </div>
                )}
            </Show>
        </div>
    );
}
