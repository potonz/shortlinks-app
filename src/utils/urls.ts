export const baseUrl = new URL(import.meta.env.VITE_SHORT_LINK_BASE_URL);
export const fullBaseHref = baseUrl.href.replace(/\/*$/, "/");
export const baseUrlWithoutScheme = fullBaseHref.replace(baseUrl.protocol + "//", "");

export const REDIRECT_WHITELIST = [
    /^https?:\/\/([a-zA-Z0-9-]+\.)*poto\.nz(\/.*)?$/,
    /^\/(?!\/)(?:(?!\/\/).)*$/,
] as const;
