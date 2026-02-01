import { createManager, type ICache, type IShortLinksManager } from "@potonz/shortlinks-manager";
import { createD1Backend } from "@potonz/shortlinks-manager-cf-d1";
import { createServerOnlyFn } from "@tanstack/solid-start";
import { env, waitUntil } from "cloudflare:workers";

let manager: IShortLinksManager;
let shortIdLength = 3;

export const getShortLinksManager = createServerOnlyFn(async () => {
    if (!manager) {
        const storedLength = await env.CONFIG!.get("short_id_length");
        shortIdLength = storedLength ? parseInt(storedLength) : 3;

        manager = await createManager({
            backend: createD1Backend(env.DB!),
            caches: [
                createInMemoryCache(),
                createCloudflareKvCache(env.SHORTLINKS_CACHE!),
            ],
            waitUntil,
            shortIdLength,
            async onShortIdLengthUpdated(newLength) {
                shortIdLength = newLength;
                try {
                    await env.CONFIG!.put("short_id_length", newLength.toString());
                }
                catch (err) {
                    console.warn("Failed when updating KV short_id_length", err);
                }
            },
        });
    }

    return manager;
});

function createInMemoryCache(): ICache {
    const cache: Record<string, string> = {};
    return {
        get(shortId) {
            if (shortId in cache) {
                return cache[shortId];
            }
            return null;
        },
        set(shortId, targetUrl) {
            cache[shortId] = targetUrl;
        },
    };
}

function createCloudflareKvCache(kv: KVNamespace): ICache {
    return {
        get(shortId) {
            return kv.get(shortId);
        },
        set(shortId, targetUrl) {
            return kv.put(shortId, targetUrl, { expirationTtl: 31_536_000 });
        },
    };
}
