import { getShortLinksManager } from "~/libs/shortlinks/manager";
import type { IUpdateLinkResult } from "~/types/links";

export async function updateLinkQuery(shortId: string, targetUrl: string, baseUrlId: number | null): Promise<IUpdateLinkResult> {
    const manager = await getShortLinksManager();
    const updated = await manager.updateShortLink(shortId, targetUrl, baseUrlId);

    if (!updated) {
        return {
            success: false,
            error: "Link not found or access denied",
        };
    }

    return {
        success: true,
    };
}
