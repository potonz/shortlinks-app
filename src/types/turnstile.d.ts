import type { Turnstile } from "@types/cloudflare-turnstile";

declare interface Window {
    turnstile: Turnstile;
}
