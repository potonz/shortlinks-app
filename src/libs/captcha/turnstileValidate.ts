import { createServerOnlyFn } from "@tanstack/solid-start";

export const validateCaptcha = createServerOnlyFn(async (token: string, clientIp: string | null) => {
    if (!process.env.CF_TURNSTILE_SECRET_KEY) {
        console.error("Missing CF_TURNSTILE_SECRET_KEY");
        return false;
    }

    try {
        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: new URLSearchParams({
                secret: process.env.CF_TURNSTILE_SECRET_KEY,
                response: token,
                remoteip: clientIp ?? "",
            }),
        });

        if (!response.ok) {
            return false;
        }

        console.log("Captcha response", await response.json());

        return true;
    }
    catch {
        return false;
    }
});
