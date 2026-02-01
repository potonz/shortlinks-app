import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tailwindcss(),
        tanstackStart({
            prerender: {
                // Enable prerendering
                enabled: true,

                // Enable if you need pages to be at `/page/index.html` instead of `/page.html`
                autoSubfolderIndex: true,

                // If disabled, only the root path or the paths defined in the pages config will be prerendered
                autoStaticPathsDiscovery: true,

                // How many prerender jobs to run at once
                concurrency: 2,

                // Whether to extract links from the HTML and prerender them also
                crawlLinks: true,

                // Filter function takes the page object and returns whether it should prerender
                // filter: ({ path }) => !path.startsWith('/do-not-render-me'),

                // Number of times to retry a failed prerender job
                retryCount: 2,

                // Delay between retries in milliseconds
                retryDelay: 1000,

                // Maximum number of redirects to follow during prerendering
                maxRedirects: 5,

                // Fail if an error occurs during prerendering
                failOnError: true,

                // Callback when page is successfully rendered
                onSuccess: ({ page }) => {
                    console.log(`Rendered ${page.path}!`);
                },
            },
            // Optional configuration for specific pages
            // Note: When autoStaticPathsDiscovery is enabled (default), discovered static
            // routes will be merged with the pages specified below
            pages: [
                {
                    path: "/privacy-policy",
                },
                {
                    path: "/terms-of-service",
                },
            ],
        }),
        solidPlugin({ ssr: true }),
    ],
});
