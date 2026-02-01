import { createAuthClient } from "better-auth/solid";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
});

export type Session = typeof authClient.$Infer.Session;
