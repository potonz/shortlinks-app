import { createFileRoute } from "@tanstack/solid-router";
import { toSolidStartHandler } from "better-auth/solid-start";

import { auth } from "~/libs/auth/auth";

export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: toSolidStartHandler(auth),
    },
});
