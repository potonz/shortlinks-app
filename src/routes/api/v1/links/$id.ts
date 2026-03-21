import { createFileRoute } from "@tanstack/solid-router";
import { z } from "zod";

import { verifyApiKeyFromRequest } from "~/libs/auth/verifyApiKeyFromRequest";
import { deleteLinkQuery } from "~/libs/shortlinks/deleteLink.server";
import { fetchLinkDetailsQuery } from "~/libs/shortlinks/fetchLinkDetails.server";
import { getBaseUrls } from "~/libs/shortlinks/getBaseUrls.functions";
import { updateLinkQuery } from "~/libs/shortlinks/updateLink.server";
import { createBaseUrlsHelper } from "~/utils/urls";

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export const Route = createFileRoute("/api/v1/links/$id")({
    server: {
        handlers: {
            GET: async ({ request, params }) => {
                const auth = await verifyApiKeyFromRequest(request);
                if (!auth.success) return auth.response;

                const id = parseInt(params.id);
                if (isNaN(id)) return json({ error: "Invalid link ID" }, 400);

                const result = await fetchLinkDetailsQuery(id, auth.userId);
                if (!result.success) return json({ error: result.error }, 404);
                return json(result.data);
            },

            PATCH: async ({ request, params }) => {
                const auth = await verifyApiKeyFromRequest(request);
                if (!auth.success) return auth.response;

                const id = parseInt(params.id);
                if (isNaN(id)) return json({ error: "Invalid link ID" }, 400);

                const link = await fetchLinkDetailsQuery(id, auth.userId);
                if (!link.success || !link.data) return json({ error: "Link not found or access denied" }, 404);

                const baseUrls = await getBaseUrls();
                const baseUrlsHelper = createBaseUrlsHelper(baseUrls);

                const bodySchema = z.object({
                    url: baseUrlsHelper.validationShortLink(),
                });

                let body: z.infer<typeof bodySchema>;
                try {
                    body = bodySchema.parse(await request.json());
                }
                catch {
                    return json({ error: "Invalid request body" }, 400);
                }

                const result = await updateLinkQuery(
                    link.data.shortId,
                    body.url,
                    link.data.baseUrlId,
                );

                if (!result.success) return json({ error: result.error }, 422);
                return json({ success: true });
            },

            DELETE: async ({ request, params }) => {
                const auth = await verifyApiKeyFromRequest(request);
                if (!auth.success) return auth.response;

                const id = parseInt(params.id);
                if (isNaN(id)) return json({ error: "Invalid link ID" }, 400);

                const result = await deleteLinkQuery(id, auth.userId);
                if (!result.success) return json({ error: result.error }, 404);
                return json({ success: true });
            },
        },
    },
});
