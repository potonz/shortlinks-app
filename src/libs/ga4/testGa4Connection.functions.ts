import { createServerFn } from "@tanstack/solid-start";
import { z } from "zod";

import { testGa4Connection as testGa4ConnectionServer } from "~/libs/ga4/testGa4Connection.server";

const testGa4ConnectionValidator = z.object({
    measurementId: z.string().min(1),
    apiSecret: z.string().min(1),
});

interface ITestGa4ConnectionResult {
    success: boolean;
    error?: string;
}

export const testGa4Connection = createServerFn({ method: "POST" })
    .inputValidator(testGa4ConnectionValidator)
    .handler(async ({ data }): Promise<ITestGa4ConnectionResult> => {
        try {
            return await testGa4ConnectionServer(data);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error testing GA4 connection:", err);
                return { success: false, error: err.message };
            }
            throw err;
        }
    });
