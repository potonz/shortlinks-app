import { createServerFn } from "@tanstack/solid-start";
import { getRequest } from "@tanstack/solid-start/server";
import { z } from "zod";

import { createBaseUrlsHelper } from "~/utils/urls";

import { auth } from "../auth/auth";
import { validateCaptcha } from "../captcha/turnstileValidate";
import { createLinkQuery } from "./createLinkQuery";
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

        if (userId) {
            const result = await createLinkQuery(userId, targetUrl, data.baseUrlId ?? null);
            if (!result.success) {
                console.error(result.error);
                return null;
            }
            return result.shortId;
        }

        const manager = await getShortLinksManager();
        return await manager.createShortLink(targetUrl, data.baseUrlId ?? null);
    });
