import { createFileRoute } from "@tanstack/solid-router";
import { z } from "zod";

import { verifyApiKeyFromRequest } from "~/libs/auth/verifyApiKeyFromRequest";
import { createLinkQuery } from "~/libs/shortlinks/createLinkQuery";
import { fetchUserLinksQuery } from "~/libs/shortlinks/fetchUserLinks.server";
import { getBaseUrls } from "~/libs/shortlinks/getBaseUrls.functions";
import { createBaseUrlsHelper } from "~/utils/urls";

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export const Route = createFileRoute("/api/v1/links/")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const auth = await verifyApiKeyFromRequest(request);
                if (!auth.success) return auth.response;

                const url = new URL(request.url);
                const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
                const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")));

                return json(await fetchUserLinksQuery({ page, limit }, auth.userId));
            },

            POST: async ({ request }) => {
                const auth = await verifyApiKeyFromRequest(request);
                if (!auth.success) return auth.response;

                const baseUrls = await getBaseUrls();
                const baseUrlsHelper = createBaseUrlsHelper(baseUrls);

                const bodySchema = z.object({
                    url: baseUrlsHelper.validationShortLink(),
                    baseUrlId: z.number().int().positive().nullable().optional(),
                });

                let body: z.infer<typeof bodySchema>;
                try {
                    body = bodySchema.parse(await request.json());
                }
                catch {
                    return json({ error: "Invalid request body" }, 400);
                }

                const result = await createLinkQuery(auth.userId, body.url, body.baseUrlId ?? null);
                if (!result.success) {
                    return json({ error: result.error }, 500);
                }

                return json({ success: true, shortId: result.shortId, linkMapId: result.linkMapId }, 201);
            },
        },
    },
});
