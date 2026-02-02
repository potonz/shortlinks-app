import { type QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
    createRootRouteWithContext,
    ErrorComponent,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { type JSXElement, Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";

import { Footer } from "~/components/common/Footer";
import { Navbar } from "~/components/common/Navbar";
import NotificationsContainer from "~/components/notifications/NotificationsContainer";
import { queryClient } from "~/queryClient";
import { LinkHistoryProvider } from "~/stores/linkHistoryStore";
import { SidebarProvider } from "~/stores/sidebarStore";
import styleCss from "~/styles/styles.css?url";

export const Route = createRootRouteWithContext <{ queryClient: QueryClient }>()({
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
    component: RootComponent,
    pendingComponent: () => "Loading...",
    notFoundComponent: () => "Not found",
    errorComponent: ErrorComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <LinkHistoryProvider>
                <SidebarProvider>
                    <RootDocument>
                        <Outlet />
                    </RootDocument>
                </SidebarProvider>
            </LinkHistoryProvider>
        </QueryClientProvider>
    );
}

function RootDocument(props: { children: JSXElement }) {
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
                <main class="grow flex flex-col items-center justify-center p-4">
                    <NotificationsContainer />
                    <Suspense>
                        {props.children}
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
