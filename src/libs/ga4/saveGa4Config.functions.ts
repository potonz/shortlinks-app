import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { saveGa4Config as saveGa4ConfigServer } from "~/libs/ga4/saveGa4Config.server";
import type { TGA4Config } from "~/libs/ga4/types";

const saveGa4ConfigValidator = z.object({
    name: z.string().min(1).max(100),
    measurementId: z.string().min(1),
    apiSecret: z.string().min(1),
    enabled: z.boolean().optional(),
});

interface ISaveGa4ConfigResult {
    success: boolean;
    data?: TGA4Config;
    error?: string;
}

export const saveGa4Config = createServerFn({ method: "POST" })
    .inputValidator(saveGa4ConfigValidator)
    .handler(async ({ data }): Promise<ISaveGa4ConfigResult> => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (!userId) {
                return { success: false, error: "User not authenticated" };
            }

            return await saveGa4ConfigServer(data, userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error saving GA4 config:", err);
                return { success: false, error: err.message };
            }
            throw err;
        }
    });
