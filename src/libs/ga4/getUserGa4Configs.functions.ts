import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";

import { auth } from "~/libs/auth/auth";
import { getUserGa4Configs as getUserGa4ConfigsServer } from "~/libs/ga4/getUserGa4Configs.server";
import type { TGA4Config } from "~/libs/ga4/types";

interface IGetUserGa4ConfigsResult {
    success: boolean;
    data?: TGA4Config[];
    error?: string;
}

export const getUserGa4Configs = createServerFn({ method: "GET" })
    .handler(async (): Promise<IGetUserGa4ConfigsResult> => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (!userId) {
                return { success: false, error: "User not authenticated" };
            }

            return await getUserGa4ConfigsServer(userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching GA4 configs:", err);
                return { success: false, error: err.message };
            }
            throw err;
        }
    });
