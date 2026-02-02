import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount, Show } from "solid-js";
import { z } from "zod";

import { CopyButton } from "../components/CopyButton";
import { LinksHistory } from "../components/LinksHistory";
import { addNotification } from "../components/notifications/notificationUtils";
import { createShortLink } from "../libs/shortlinks/createShortLink";
import { useLinkHistory } from "../stores/linkHistoryStore";
import { baseUrlWithoutScheme, fullBaseHref } from "../utils/urls";

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

function App() {
    const [url, setUrl] = createSignal("");
    let captchaContainerRef!: HTMLDivElement;
    let captchaLoaderRef!: HTMLDivElement;
    const [captchaToken, setCaptchaToken] = createSignal("");
    const { addLinkToHistory } = useLinkHistory();
    const canSubmit = () => !isSubmitting() && captchaToken() && z.httpUrl().refine(url => !url.startsWith(fullBaseHref)).safeParse(url()).success;
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [shortIdGenerated, setShortIdGenerated] = createSignal("");

    function onInput(event: Event & { currentTarget: HTMLInputElement }) {
        let value = event.currentTarget.value;

        if (value.length > 0 && !/^[a-zA-Z]+:\/\//.test(value)) {
            if (/.+\.\w{2}/.test(value)) {
                value = "https://" + value;
            }
        }

        setUrl(value);
    }

    function onChange(event: Event & { currentTarget: HTMLInputElement }) {
        let value = event.currentTarget.value.trim();

        // If the user doesn't input a schema, we default to https
        if (value.length > 0 && !/^[a-zA-Z]+:\/\//.test(value)) {
            value = "https://" + value;
        }

        setUrl(value);
    }

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const _url = url();
        const _captchaToken = captchaToken();
        if (!_url) return;
        if (!_captchaToken) return;

        setIsSubmitting(true);

        createShortLink({
            data: {
                url: _url,
                captchaToken: _captchaToken,
            },
        }).then((shortId) => {
            if (shortId) {
                setUrl("");
                setShortIdGenerated(shortId);
                addLinkToHistory(shortId, _url);
            }
            else {
                addNotification("Unable to generate a short link :( Please try again later.", "error");
            }
        }).catch((err) => {
            if (err instanceof Error) {
                const zodErrors = JSON.parse(err.message);
                if (Array.isArray(zodErrors)) {
                    zodErrors.forEach(err => addNotification(err.message, "error", 5000));
                    return;
                }
            }
            throw err;
        }).catch((err) => {
            addNotification("Unable to generate a short link :( Please try again later.", "error");
            console.error(err);
        }).finally(() => {
            setIsSubmitting(false);
            turnstile.reset(captchaContainerRef);
        });
    };

    onMount(() => {
        function loadTurnstile() {
            if ("turnstile" in globalThis) {
                turnstile.render(captchaContainerRef, {
                    "sitekey": import.meta.env.VITE_CF_TURNSTILE_SITE_KEY,
                    "action": "generate_short_link",
                    "callback": (token: string) => {
                        setCaptchaToken(token);
                    },
                    "theme": "dark",
                    "size": "flexible",
                    "expired-callback": () => {
                        setCaptchaToken("");
                    },
                    "error-callback": (error) => {
                        console.error(error);
                        setCaptchaToken("");
                    },
                });
                captchaLoaderRef.style.display = "none";
            }
            else {
                setTimeout(loadTurnstile, 500);
            }
        }
        loadTurnstile();
    });

    return (
        <div class="w-full max-w-xl text-center">
            <form onSubmit={handleSubmit} class="space-y-6">
                <div>
                    <label class="block mb-2" for="input_url">Enter your long URL</label>
                    <input
                        type="url"
                        id="input_url"
                        placeholder="https://IamAVeryLongUrlWithAnalyticsStuff.Tld/?utm_campaign=potonz&amp;utm_medium=yes"
                        value={url()}
                        onInput={onInput}
                        onChange={onChange}
                        required
                        class="w-full px-6 py-4 bg-zinc-950 text-center text-white placeholder-zinc-500 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all animation-duration-300 placeholder-shown:text-ellipsis"
                    />
                </div>

                <div id="turnstile-container" ref={captchaContainerRef}>
                    <div class="h-[65px] animate-pulse rounded-lg bg-zinc-900" ref={captchaLoaderRef}></div>
                </div>

                <button
                    type="submit"
                    class="w-full py-4 flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all animation-duration-300 bg-zinc-300 text-black hover:bg-zinc-100 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-950 disabled:text-zinc-700"
                    disabled={!canSubmit()}
                >
                    <Show
                        when={isSubmitting()}
                        fallback="Shorten it"
                    >
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
                        {/* forces inner height to match text */}
                        <div class="h-lh"></div>
                    </Show>
                </button>
            </form>

            <Show when={shortIdGenerated()}>
                {shortId => (
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold text-zinc-300 mb-4">Your new link</h3>
                        <div class="p-4 border-2 border-zinc-400 rounded-2xl flex">
                            <div class="grow text-left">
                                <span class="text-zinc-500">{baseUrlWithoutScheme}</span>
                                <span class="text-white">{shortId()}</span>
                            </div>
                            <div class="pl-2">
                                <CopyButton text={fullBaseHref + shortId()} />
                            </div>
                        </div>
                    </div>
                )}
            </Show>

            {/* Link History Section */}
            <div class="mt-12">
                <LinksHistory baseUrlWithoutScheme={baseUrlWithoutScheme} fullBaseHref={fullBaseHref} />
            </div>
        </div>
    );
}
