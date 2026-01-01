import { createServerOnlyFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

import { getShortLinksManager } from "./manager";

export const getTargetUrl = createServerOnlyFn(async (shortId: string) => {
    const cachedUrl = await env.SHORTLINKS_CACHE.get(shortId);

    if (cachedUrl) {
        return cachedUrl;
    }

    const manager = await getShortLinksManager();
    const targetUrl = await manager.getTargetUrl(shortId);

    if (targetUrl) {
        await env.SHORTLINKS_CACHE.put(shortId, targetUrl, { expirationTtl: 31_536_000 });
    }

    return targetUrl;
});
