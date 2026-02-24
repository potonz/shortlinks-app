import type { IBaseUrlRecord } from "@potonz/shortlinks-manager";
import { createServerFn } from "@tanstack/solid-start";

import { getShortLinksManager } from "~/libs/shortlinks/manager";

let cached: IBaseUrlRecord[] | null = null;

export const getBaseUrls = createServerFn({ method: "GET" })
    .handler(async () => {
        if (!cached) {
            const manager = await getShortLinksManager();
            cached = await manager.baseUrl.list(true);
        }

        return cached;
    });
