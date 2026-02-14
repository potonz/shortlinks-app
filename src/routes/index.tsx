import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, onMount, Show } from "solid-js";
import { z } from "zod";

import { CopyButton } from "../components/CopyButton";
import { LinksHistory } from "../components/LinksHistory";
import { addNotification } from "../components/notifications/notificationUtils";
import { createShortLink } from "../libs/shortlinks/createShortLink";
import { useLinkHistory } from "../stores/linkHistoryStore";
import { BASE_URLS, fullBaseHref, getBaseUrlById, getBaseUrlHref, getBaseUrlLabel } from "../utils/urls";

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
    const [selectedBaseUrlId, setSelectedBaseUrlId] = createSignal<number>(BASE_URLS[0].id);
    let captchaContainerRef!: HTMLDivElement;
    let captchaLoaderRef!: HTMLDivElement;
    const [captchaToken, setCaptchaToken] = createSignal("");
    const { addLinkToHistory } = useLinkHistory();

    const selectedBaseUrl = () => getBaseUrlById(selectedBaseUrlId());
    const selectedFullBaseHref = () => selectedBaseUrl()?.url.href ?? fullBaseHref;

    const canSubmit = () => !isSubmitting() && captchaToken() && z.httpUrl().refine(url => !url.startsWith(selectedFullBaseHref())).safeParse(url()).success;
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [shortIdGenerated, setShortIdGenerated] = createSignal<{ id: string; baseUrlId: number } | null>(null);

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
        const _baseUrlId = selectedBaseUrlId();
        if (!_url) return;
        if (!_captchaToken) return;

        setIsSubmitting(true);

        createShortLink({
            data: {
                url: _url,
                captchaToken: _captchaToken,
                baseUrlId: _baseUrlId,
            },
        }).then((shortId) => {
            if (shortId) {
                setUrl("");
                setShortIdGenerated({ id: shortId, baseUrlId: _baseUrlId });
                addLinkToHistory(shortId, _url, _baseUrlId);
            }
            else {
                addNotification("Unable to generate a short link :( Please try again later.", "error");
            }
        }).catch((err) => {
            if (err instanceof Error) {
                try {
                    const zodErrors = JSON.parse(err.message);
                    if (Array.isArray(zodErrors)) {
                        zodErrors.forEach(err => addNotification(err.message, "error", 5000));
                        return;
                    }
                }
                catch { /* not a JSON, fallback to generic error notification */ }
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
        <div class="w-full max-w-4xl text-center">
            <form onSubmit={handleSubmit} class="space-y-6">
                <div>
                    <label class="block mb-2" for="input_url">Enter your long URL</label>
                    <div class="flex flex-wrap gap-2">
                        <select
                            id="select_base_url"
                            value={selectedBaseUrlId()}
                            onChange={e => setSelectedBaseUrlId(Number(e.currentTarget.value))}
                            class="grow md:grow-0 px-4 py-4 bg-zinc-900 text-white border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-shadow cursor-pointer"
                        >
                            <For each={BASE_URLS}>
                                {baseUrl => (
                                    <option value={baseUrl.id}>{baseUrl.url.host}</option>
                                )}
                            </For>
                        </select>
                        <input
                            type="url"
                            id="input_url"
                            placeholder="https://IamAVeryLongUrlWithAnalyticsStuff.Tld/?utm_campaign=potonz&amp;utm_medium=yes"
                            value={url()}
                            onInput={onInput}
                            onChange={onChange}
                            required
                            class="grow min-w-0 px-6 py-4 bg-zinc-950 text-center text-white placeholder-zinc-500 border border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-shadow placeholder-shown:text-ellipsis"
                        />
                    </div>
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
                {link => (
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold text-zinc-300 mb-4">Your new link</h3>
                        <div class="p-4 border-2 border-zinc-400 rounded-2xl flex">
                            <div class="grow text-left">
                                <span class="text-zinc-500">{getBaseUrlLabel(link().baseUrlId)}</span>
                                <span class="text-white">

                                    {link().id}
                                </span>
                            </div>
                            <div class="pl-2">
                                <CopyButton text={getBaseUrlHref(link().baseUrlId) + link().id} />
                            </div>
                        </div>
                    </div>
                )}
            </Show>

            {/* Link History Section */}
            <div class="mt-12">
                <LinksHistory />
            </div>
        </div>
    );
}
