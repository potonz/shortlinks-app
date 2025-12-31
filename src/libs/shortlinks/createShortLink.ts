import { createServerFn } from "@tanstack/solid-start";
import { getRequest } from "@tanstack/solid-start/server";
import { env } from "cloudflare:workers";
import { z } from "zod/mini";

import { validateCaptcha } from "../captcha/turnstileValidate";

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

        const storedLength = await env.CONFIG.get("short_id_length");
        const shortIdLength = storedLength ? parseInt(storedLength) : 3;
        const manager = new LinksManager(env.DB, shortIdLength, async (newLength) => {
            try {
                await env.CONFIG.put("short_id_length", newLength.toString());
            }
            catch { /* */ }
        });

        const shortId = await manager.createShortLink(data.url);

        return shortId;
    });
