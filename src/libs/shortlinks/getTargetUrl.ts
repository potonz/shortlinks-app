import { LinksManager } from "@potonz/shortlinks-manage-cf-d1";
import { createServerOnlyFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

export const getTargetUrl = createServerOnlyFn(async (shortId: string) => {
    const manager = new LinksManager(env.DB, 3, () => undefined);
    return await manager.getTargetUrl(shortId);
});
