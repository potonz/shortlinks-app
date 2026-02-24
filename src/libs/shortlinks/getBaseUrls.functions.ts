import { createServerFn } from "@tanstack/solid-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

import { getShortLinksManager } from "~/libs/shortlinks/manager";

export const getBaseUrls = createServerFn({ method: "GET" })
    .middleware([staticFunctionMiddleware])
    .handler(async () => {
        const manager = await getShortLinksManager();
        const baseUrls = await manager.baseUrl.list(true);
        return baseUrls;
    });
