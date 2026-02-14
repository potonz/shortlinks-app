export interface ILink {
    id: number;
    shortId: string;
    originalUrl: string;
    totalClicks: number;
    createdAt: string;
    lastAccessedAt?: string;
    isActive: boolean;
    baseUrlId: number | null;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IFetchLinksResult {
    success: boolean;
    data?: ILink[];
    error?: string;
    pagination?: IPagination;
}

export interface IFetchLinkDetailsResult {
    success: boolean;
    data?: ILink;
    error?: string;
}

export interface IUpdateLinkInput {
    originalUrl?: string;
    expiresAt?: string | null;
    isActive?: boolean;
    baseUrlId?: number;
}

export interface IUpdateLinkResult {
    success: boolean;
    error?: string;
}

export interface IDeleteLinkResult {
    success: boolean;
    error?: string;
}

export interface ICreateLinkInput {
    url: string;
    baseUrlId?: number;
    captchaToken: string;
}

export interface IBaseUrl {
    id: number;
    baseUrl: string;
    isActive?: boolean;
}
