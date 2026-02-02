import { createRouter } from "@tanstack/solid-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/solid-router-ssr-query";

import { queryClient } from "./queryClient";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
    const router = createRouter({
        routeTree,
        context: { queryClient },
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
        defaultPendingMinMs: 50,
    });
    setupRouterSsrQueryIntegration({
        router,
        queryClient,
    });

    return router;
};
