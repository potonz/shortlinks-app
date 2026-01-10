import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";

import { Footer } from "../components/common/Footer";
import { Navbar } from "../components/common/Navbar";
import NotificationsContainer from "../components/notifications/NotificationsContainer";
import styleCss from "../styles/styles.css?url";

export const Route = createRootRouteWithContext()({
    head: () => ({
        meta: [
            {
                title: "Poto",
                charset: "utf-8",
            },
            {
                name: "description",
                content: "Shorten your URLs with Poto",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
            },
        ],
        links: [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" },
            { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13/font/bootstrap-icons.min.css" },
            { rel: "stylesheet", href: styleCss },
        ],
    }),
    shellComponent: RootComponent,
});

function RootComponent() {
    return (
        <html>
            <head>
                <HydrationScript />
            </head>
            <body class="flex flex-col">
                <HeadContent />
                <div class="bg-glow select-none"></div>
                <div class="stars-container select-none">
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                    <div class="star"></div>
                </div>
                <Navbar />
                <main class="relative grow flex flex-col items-center justify-center p-4">
                    <NotificationsContainer />
                    <Suspense>
                        <Outlet />
                        <TanStackRouterDevtools />
                    </Suspense>
                </main>
                <div class="mt-4 md:mt-8 p-4 w-full">
                    <Footer />
                </div>
                <Scripts />
            </body>
        </html>
    );
}
