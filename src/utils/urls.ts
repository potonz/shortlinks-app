import type { IBaseUrlRecord } from "@potonz/shortlinks-manager";
import { z } from "zod";

export type TBaseUrl = {
    id: number;
    url: URL;
    isActive: boolean;
};

export function createBaseUrlsHelper(baseUrls: IBaseUrlRecord[]) {
    const BASE_URLS = baseUrls.map((baseUrl) => {
        try {
            const url = new URL(baseUrl.baseUrl);
            return { id: baseUrl.id, url, isActive: !!baseUrl.isActive };
        }
        catch (error) {
            console.error(`Invalid URL for base URL with ID ${baseUrl.id}:`, error);
            return null;
        }
    }).filter(baseUrl => baseUrl !== null);

    return {
        BASE_URLS,
        BASE_URLS_ACTIVE: BASE_URLS.filter(base => base.isActive),

        getBaseUrlById(id: number): TBaseUrl | undefined {
            const baseUrl = BASE_URLS.find(base => base.id === id);

            if (!baseUrl) {
                return undefined;
            }

            return baseUrl;
        },

        getBaseUrlLabel(id: number): string | undefined {
            const base = this.getBaseUrlById(id);
            const host = base?.url.host;

            if (!host) {
                return undefined;
            }

            return host.replace(/\/*$/, "/");
        },

        getBaseUrlHref(id: number): string | undefined {
            const base = this.getBaseUrlById(id);
            const href = base?.url.href;

            if (!href) {
                return undefined;
            }

            return href.replace(/\/*$/, "/");
        },

        validationShortLink() {
            return z.httpUrl().refine((url) => {
                try {
                    const parsedUrl = new URL(url);
                    return BASE_URLS.some(base => parsedUrl.host === base.url.host);
                }
                catch {
                    return false;
                }
            }, "Invalid URL");
        },
    };
}

export const REDIRECT_WHITELIST = [
    /^https?:\/\/([a-zA-Z0-9-]+\.)*poto\.nz(\/.*)?$/,
    /^\/(?!\/)(?:(?!\/\/).)*$/,
] as const;
