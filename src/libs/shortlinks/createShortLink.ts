import { createServerFn } from "@tanstack/solid-start";
import { getRequest } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { z } from "zod";

import { createBaseUrlsHelper } from "~/utils/urls";

import { auth } from "../auth/auth";
import { validateCaptcha } from "../captcha/turnstileValidate";
import { getBaseUrls } from "./getBaseUrls.functions";
import { getShortLinksManager } from "./manager";

const validator = z.object({
    url: z.httpUrl("Invalid URL, please check and try again."),
    captchaToken: z.string("Invalid captcha token, please reload the page or try again.").min(1, "missing captcha token"),
    baseUrlId: z.number().nullable().optional(),
});

export const createShortLink = createServerFn({ method: "POST" })
    .inputValidator(validator)
    .handler(async ({ data }) => {
        const baseUrls = await getBaseUrls();
        const baseUrlsHelper = createBaseUrlsHelper(baseUrls);

        const targetUrl = baseUrlsHelper.validationShortLink().parse(data.url);

        const request = getRequest();
        const session = await auth.api.getSession({ headers: request.headers });
        const userId = session?.user?.id;

        const clientIp = request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip");

        if (!validateCaptcha(data.captchaToken, clientIp)) {
            return null;
        }

        const manager = await getShortLinksManager();
        const shortId = await manager.createShortLink(targetUrl, data.baseUrlId ?? null);

        if (userId) {
            const linkMapResult = await env.DB.prepare(`
                SELECT id FROM sl_links_map WHERE short_id = ? AND (base_url_id = ? OR (base_url_id IS NULL AND ? IS NULL))
            `).bind(shortId, data.baseUrlId ?? null, data.baseUrlId ?? null).first<{ id: number }>();

            if (!linkMapResult) {
                console.error("Failed to find created link in sl_links_map");
                return null;
            }

            const result = await env.DB.prepare(`
                INSERT INTO sl_user_links (link_map_id, user_id)
                VALUES (?, ?)
            `).bind(linkMapResult.id, userId).run();

            if (!result.success) {
                console.error(result.error);
                return null;
            }
        }

        return shortId;
    });
