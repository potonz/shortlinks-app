export interface IBuildSummaryQueryResult {
    totalLinks: number;
    totalClicks: number;
    uniqueVisitors: number;
    last7DaysClicks: number;
    userId?: string;
}

export interface IBuildLinkRequestsQueryParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    country?: string;
    referrer?: string;
    userId?: string;
}

export interface IBuildLinkRequestsQueryResult {
    data: TLinkRequest[];
    total: number;
    page: number;
    pageSize: number;
}

export interface TLinkRequest {
    id: number;
    short_id: string;
    ip: string;
    country: string;
    region: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    timezone: string;
    asn: string;
    asOrganization: string;
    userAgent: string;
    referer: string | null;
    timestamp: string;
    userId?: string;
}

export interface IBuildCountriesQueryResult {
    country: string;
    clicks: number;
    userId?: string;
}

export interface IBuildReferrersQueryResult {
    referrer: string;
    clicks: number;
    userId?: string;
}

export interface IBuildClicksByTimeQueryResult {
    date: Date;
    clicks: number;
    userId?: string;
}
