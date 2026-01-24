export interface IAnalyticsSummary {
    totalLinks: number;
    totalClicks: number;
    uniqueVisitors: number;
    last7DaysClicks: number;
}

export interface IClicksByTimeData {
    date: string;
    clicks: number;
}

export interface IReferrerData {
    referrer: string;
    clicks: number;
}

export interface ICountryData {
    country: string;
    clicks: number;
}

export interface ILink {
    shortId: string;
    targetUrl: string;
    totalClicks: number;
    createdAt: string;
    lastAccessedAt: string;
}

export interface ILinkRequest {
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

export interface ILinkRequestsQueryParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    country?: string;
    referrer?: string;
}

export interface ILinkRequestsQueryResult {
    data: ILinkRequest[];
    total: number;
    page: number;
    pageSize: number;
}
