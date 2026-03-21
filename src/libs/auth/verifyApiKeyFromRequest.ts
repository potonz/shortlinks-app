import { auth } from "~/libs/auth/auth";

export type ApiKeyVerifyResult =
    | { success: true; userId: string }
    | { success: false; response: Response };

export async function verifyApiKeyFromRequest(request: Request): Promise<ApiKeyVerifyResult> {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return {
            success: false,
            response: new Response(
                JSON.stringify({ error: "Missing or invalid Authorization header" }),
                { status: 401, headers: { "Content-Type": "application/json" } },
            ),
        };
    }

    const key = authHeader.slice(7);
    const result = await auth.api.verifyApiKey({ body: { key } });

    if (!result.valid || !result.key) {
        return {
            success: false,
            response: new Response(
                JSON.stringify({ error: result.error?.message ?? "Invalid API key" }),
                { status: 401, headers: { "Content-Type": "application/json" } },
            ),
        };
    }

    return { success: true, userId: result.key.userId };
}
