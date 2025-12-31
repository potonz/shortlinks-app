import { createServerFn } from "@tanstack/solid-start";
import { getRequest } from "@tanstack/solid-start/server";
import { z } from "zod/mini";

import { validateCaptcha } from "../captcha/turnstileValidate";
import { getShortLinksManager } from "./manager";

const validator = z.object({
    url: z.httpUrl(),
    captchaToken: z.string(),
});

export const createShortLink = createServerFn({ method: "POST" })
    .inputValidator(validator)
    .handler(async ({ data }) => {
        const request = getRequest();
        const clientIp = request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip");

        if (!validateCaptcha(data.captchaToken, clientIp)) {
            return null;
        }

        const manager = await getShortLinksManager();
        const shortId = await manager.createShortLink(data.url);

        return shortId;
    });
