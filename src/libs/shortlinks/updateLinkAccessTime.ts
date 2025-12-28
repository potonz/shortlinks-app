import { LinksManager } from "@potonz/shortlinks-manage-cf-d1";
import { createServerOnlyFn } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";

export const updateLinkAccessTime = createServerOnlyFn(async (shortId: string) => {
    const manager = new LinksManager(env.DB, 3, () => undefined);
    await manager.updateShortLinkLastAccessTime(shortId);
});
