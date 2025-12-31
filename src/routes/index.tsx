import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { z } from "zod/mini";

import { CopyButton } from "../components/CopyButton";
import { createShortLink } from "../libs/shortlinks/createShortLink";

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

const baseUrl = new URL(import.meta.env.VITE_SHORT_LINK_BASE_URL);
const fullBaseHref = baseUrl.href.replace(/\/*$/, "/");
const baseUrlWithoutScheme = fullBaseHref.replace(baseUrl.protocol + "//", "");

function App() {
    const [url, setUrl] = createSignal("");
    let captchaContainerRef: HTMLDivElement | undefined;
    let captchaToken = "";
    const isInputUrlValid = () => z.httpUrl().safeParse(url());
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [shortIdGenerated, setShortIdGenerated] = createSignal("");

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
            turnstile.reset(captchaContainerRef);
        });
    };

    createEffect(() => {
        function loadTurnstile() {
            if ("turnstile" in globalThis) {
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
            }
            else {
                setTimeout(loadTurnstile, 1000);
            }
        }
        loadTurnstile();
    });

    return (
        <div class="w-full max-w-md text-center">
            <form onSubmit={handleSubmit} class="space-y-6">
                <div>
                    <input
                        type="url"
                        placeholder="https://www.thisisaverylonglink.what/?utm_campaign=some_campaign..."
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
                        Shorten it
                    </span>
                </button>
            </form>

            <Switch>
                <Match when={isSubmitting()}>
                    <div class="mt-12 p-4 border border-zinc-500 rounded-2xl flex justify-center items-center gap-2">
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
                        <div class="h-lh"></div>
                    </div>
                </Match>
                <Match when={shortIdGenerated()}>
                    {shortId => (
                        <div class="mt-12 p-4 border border-zinc-500 rounded-2xl flex">
                            <div class="grow text-left">
                                <span class="text-zinc-500">{baseUrlWithoutScheme}</span>
                                <span class="text-white">{shortId()}</span>
                            </div>
                            <div class="pl-2">
                                <CopyButton text={fullBaseHref + shortId()} />
                            </div>
                        </div>
                    )}
                </Match>
            </Switch>
        </div>
    );
}
