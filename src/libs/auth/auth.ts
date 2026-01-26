import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
import { env } from "cloudflare:workers";

import { D1Dialect } from "./d1helper";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: new D1Dialect({ database: env.DB }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
    },
    plugins: [
        // cookie plugin MUST be last
        tanstackStartCookies(),
    ],
});
