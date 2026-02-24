import { createServerFn } from "@tanstack/solid-start";
import { getRequestHeaders } from "@tanstack/solid-start/server";
import { z } from "zod";

import { auth } from "~/libs/auth/auth";
import { deleteGa4Config as deleteGa4ConfigServer } from "~/libs/ga4/deleteGa4Config.server";

const deleteGa4ConfigValidator = z.object({
    configId: z.number(),
});

interface IDeleteGa4ConfigResult {
    success: boolean;
    error?: string;
}

export const deleteGa4Config = createServerFn({ method: "POST" })
    .inputValidator(deleteGa4ConfigValidator)
    .handler(async ({ data }): Promise<IDeleteGa4ConfigResult> => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            const userId = session?.user?.id;

            if (!userId) {
                return { success: false, error: "User not authenticated" };
            }

            return await deleteGa4ConfigServer(data, userId);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error deleting GA4 config:", err);
                return { success: false, error: err.message };
            }
            throw err;
        }
    });
