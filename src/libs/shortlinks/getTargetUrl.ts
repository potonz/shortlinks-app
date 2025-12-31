import { createServerOnlyFn } from "@tanstack/solid-start";

import { getShortLinksManager } from "./manager";

export const getTargetUrl = createServerOnlyFn(async (shortId: string) => {
    const manager = await getShortLinksManager();
    return await manager.getTargetUrl(shortId);
});
