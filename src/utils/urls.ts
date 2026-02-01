const baseUrl = new URL(import.meta.env.VITE_SHORT_LINK_BASE_URL);
const fullBaseHref = baseUrl.href.replace(/\/*$/, "/");
const baseUrlWithoutScheme = fullBaseHref.replace(baseUrl.protocol + "//", "");

export { baseUrl, baseUrlWithoutScheme, fullBaseHref };
