export interface ILink {
    shortId: string;
    originalUrl: string;
    totalClicks: number;
    createdAt: string;
    lastAccessedAt?: string;
    isActive: boolean;
}

export interface ILinkWithUser extends ILink {
    userId: string;
}

export interface ILinkTableRow extends ILink {
    shortUrl: string;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IFetchLinksResult {
    success: boolean;
    data?: ILinkTableRow[];
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
}

export interface IUpdateLinkResult {
    success: boolean;
    error?: string;
}

export interface IDeleteLinkResult {
    success: boolean;
    error?: string;
}
