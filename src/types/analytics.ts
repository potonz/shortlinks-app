export interface TAnalyticsSummary {
    totalLinks: number;
    totalClicks: number;
    uniqueVisitors: number;
    last7DaysClicks: number;
}

export interface TClicksByTimeData {
    date: string;
    clicks: number;
}

export interface TReferrerData {
    referrer: string;
    clicks: number;
}

export interface TCountryData {
    country: string;
    clicks: number;
}

export interface TLink {
    shortId: string;
    targetUrl: string;
    totalClicks: number;
    createdAt: string;
    lastAccessedAt: string;
}

export interface TLinkRequest {
    id: number;
    shortId: string;
    ip: string;
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    timezone: string;
    asn: number;
    asOrganization: string;
    userAgent: string;
    referer: string;
    timestamp: string;
}

export interface TLinkRequestsQueryParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    country?: string;
    referrer?: string;
}

export interface TLinkRequestsQueryResult {
    data: TLinkRequest[];
    total: number;
    page: number;
    pageSize: number;
}
