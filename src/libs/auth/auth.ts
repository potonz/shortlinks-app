import { apiKey } from "@better-auth/api-key";
import { PrismaD1 } from "@prisma/adapter-d1";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
import { env, waitUntil } from "cloudflare:workers";

import { PrismaClient } from "~/generated/prisma/client";
import { deleteUserLinks } from "~/libs/shortlinks/deleteUserLinks.server";

const adapter = new PrismaD1(env.DB);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
    baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
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
    user: {
        deleteUser: {
            enabled: true,
            afterDelete: async (user) => {
                waitUntil(deleteUserLinks(user.id));
            },
        },
    },
    plugins: [
        apiKey(),
        // cookie plugin MUST be last
        tanstackStartCookies(),
    ],
});
