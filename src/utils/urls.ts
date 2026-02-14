export const BASE_URLS = [
    { id: 1, url: new URL("https://poto.nz/") },
    { id: 2, url: new URL("https://aye.nz/") },
    { id: 3, url: new URL("https://yep.nz/") },
    { id: 4, url: new URL("https://yup.nz/") },
] as const;

export const defaultBaseUrl = BASE_URLS[0];
export const baseUrl = defaultBaseUrl.url;
export const fullBaseHref = baseUrl.href.replace(/\/*$/, "/");
export const baseUrlWithoutScheme = fullBaseHref.replace(baseUrl.protocol + "//", "");

export type TBaseUrl = typeof BASE_URLS[number];

export function getBaseUrlById(id: number): TBaseUrl | undefined {
    return BASE_URLS.find(base => base.id === id);
}

export function getBaseUrlLabel(id: number): string {
    const base = getBaseUrlById(id);
    const host = base?.url.host ?? baseUrlWithoutScheme;
    return host.replace(/\/*$/, "/");
}

export function getBaseUrlHref(id: number): string {
    const base = getBaseUrlById(id);
    const href = base?.url.href ?? fullBaseHref;
    return href.replace(/\/*$/, "/");
}

export const REDIRECT_WHITELIST = [
    /^https?:\/\/([a-zA-Z0-9-]+\.)*poto\.nz(\/.*)?$/,
    /^\/(?!\/)(?:(?!\/\/).)*$/,
] as const;
