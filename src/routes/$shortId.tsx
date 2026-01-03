import { createFileRoute, redirect } from "@tanstack/solid-router";
import { waitUntil } from "cloudflare:workers";

import { getTargetUrl } from "../libs/shortlinks/getTargetUrl";
import { recordLinkRequest } from "../libs/shortlinks/recordLinkRequest";

export const Route = createFileRoute("/$shortId")({
    server: {
        handlers: {
            GET: async ({ params, request }): Promise<Response> => {
                const { shortId } = params;

                const targetUrl = await getTargetUrl(shortId);

                waitUntil(recordLinkRequest(shortId, request));

                if (targetUrl) {
                    return redirect({ href: targetUrl, statusCode: 307 });
                }

                return redirect({ to: "/", statusCode: 307 });
            },
        },
    },
});
