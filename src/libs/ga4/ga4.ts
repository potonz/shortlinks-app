import { decrypt } from "../crypto/encryption";
import type { TGA4ClickData, TGA4Config, TGA4EventPayload } from "./types";

const GA4_COLLECT_URL = "https://www.google-analytics.com/mp/collect";
const MAX_RETRIES = 3;
const EVENT_NAME = "short_link_click";

function parseUserAgent(userAgent: string): {
    device_category: "mobile" | "desktop" | "tablet";
    os: string;
    browser: string;
} {
    const ua = userAgent.toLowerCase();

    let device_category: "mobile" | "desktop" | "tablet" = "desktop";
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
        device_category = "mobile";
    }
    else if (/ipad|tablet|playbook|silk/i.test(ua)) {
        device_category = "tablet";
    }

    let os = "Unknown";
    if (/windows phone/i.test(ua)) {
        os = "Windows Phone";
    }
    else if (/win32/i.test(ua)) {
        os = "Windows";
    }
    else if (/macintosh|mac os x/i.test(ua)) {
        os = "macOS";
    }
    else if (/linux/i.test(ua)) {
        os = "Linux";
    }
    else if (/android/i.test(ua)) {
        os = "Android";
    }
    else if (/ios|iphone|ipad|ipod/i.test(ua)) {
        os = "iOS";
    }

    let browser = "Unknown";
    if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) {
        browser = "Chrome";
    }
    else if (/safari/i.test(ua) && !/chrome|edge|edg/i.test(ua)) {
        browser = "Safari";
    }
    else if (/firefox/i.test(ua)) {
        browser = "Firefox";
    }
    else if (/edge|edg/i.test(ua)) {
        browser = "Edge";
    }
    else if (/opera|opr/i.test(ua)) {
        browser = "Opera";
    }

    return { device_category, os, browser };
}

async function generateClientId(ip: string, userAgent: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ip}:${userAgent}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 128);
}

async function buildEventPayload(clickData: TGA4ClickData): Promise<TGA4EventPayload> {
    const { device_category, os, browser } = parseUserAgent(clickData.user_agent);
    const client_id = await generateClientId(clickData.ip, clickData.user_agent);

    return {
        client_id,
        events: [
            {
                name: EVENT_NAME,
                params: {
                    link_url: clickData.short_id,
                    target_url: clickData.target_url,
                    country: clickData.country,
                    city: clickData.city,
                    region: clickData.region,
                    device_category,
                    os,
                    browser,
                    session_referrer: clickData.referer || "(direct)",
                },
            },
        ],
    };
}

async function sendToGA4(
    measurementId: string,
    apiSecret: string,
    payload: TGA4EventPayload,
): Promise<boolean> {
    const url = new URL(GA4_COLLECT_URL);
    url.searchParams.set("measurement_id", measurementId);
    url.searchParams.set("api_secret", apiSecret);

    try {
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return response.ok;
    }
    catch {
        return false;
    }
}

async function sendWithRetry(
    measurementId: string,
    apiSecret: string,
    payload: TGA4EventPayload,
    attempt: number = 1,
): Promise<boolean> {
    const success = await sendToGA4(measurementId, apiSecret, payload);

    if (success) {
        return true;
    }

    if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        return sendWithRetry(measurementId, apiSecret, payload, attempt + 1);
    }

    return false;
}

export async function sendGA4Event(
    config: TGA4Config,
    clickData: TGA4ClickData,
): Promise<boolean> {
    if (!config.enabled) {
        console.log(`[GA4] Config ${config.name} is disabled, skipping`);
        return false;
    }

    try {
        const apiSecret = await decrypt(config.api_secret_encrypted);
        const payload = await buildEventPayload(clickData);

        console.log(
            `[GA4] Sending event to ${config.name} (${config.measurement_id}):`,
            JSON.stringify(payload),
        );

        const success = await sendWithRetry(config.measurement_id, apiSecret, payload);

        if (success) {
            console.log(`[GA4] Event sent successfully to ${config.name}`);
        }
        else {
            console.error(`[GA4] Failed to send event to ${config.name} after ${MAX_RETRIES} retries`);
        }

        return success;
    }
    catch (error) {
        console.error(`[GA4] Error sending event to ${config.name}:`, error);
        return false;
    }
}
