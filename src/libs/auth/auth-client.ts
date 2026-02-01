import { createAuthClient } from "better-auth/solid";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_BASE_URL,
});

export type Session = typeof authClient.$Infer.Session;
