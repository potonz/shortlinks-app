export interface TGA4Config {
    id: number;
    user_id: string;
    name: string;
    measurement_id: string;
    api_secret_encrypted: string;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface TGA4ClickData {
    short_id: string;
    target_url: string;
    country: string;
    city: string;
    region: string;
    user_agent: string;
    referer: string | null;
    ip: string;
}

export interface TGA4EventPayload {
    client_id: string;
    events: Array<{
        name: string;
        params: Record<string, string | number | undefined>;
    }>;
}
