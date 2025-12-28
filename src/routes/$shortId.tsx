import { createFileRoute, redirect } from "@tanstack/solid-router";
import { getTargetUrl } from "../libs/shortlinks/getTargetUrl";
import { updateLinkAccessTime } from "../libs/shortlinks/updateLinkAccessTime";

export const Route = createFileRoute("/$shortId")({
    server: {
        handlers: {
            GET: async ({ params, request }) => {
                const { shortId } = params;
                console.log(request.cf);
                console.log(request.headers.get("x-forwarded-for"));

                const targetUrl = await getTargetUrl(shortId);

                if (targetUrl) {
                    await updateLinkAccessTime(shortId);
                    throw redirect({ href: targetUrl, statusCode: 307 });
                }

                throw redirect({ to: "/", statusCode: 307 });
            },
        },
    },
});
