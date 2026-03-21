import { createAuthClient } from "better-auth/solid";
import { apiKeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
    plugins: [apiKeyClient()],
});

export type Session = typeof authClient.$Infer.Session;
