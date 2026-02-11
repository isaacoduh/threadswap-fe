// Enums matching your Prisma schema
export type Category = 'TOPS' | 'BOTTOMS' | 'DRESSES' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORIES' | 'BAGS' | 'JEWELRY' | 'OTHER';
export type Condition = 'NEW_WITH_TAGS' | 'NEW_WITHOUT_TAGS' | 'EXCELLENT' | 'GOOD' | 'FAIR';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED' | 'REMOVED';

// Image object as returned by the backend
export interface ListingImage {
    key: string;
    url: string | null;
}

// Nested seller info returned with listings
export interface ListingSeller {
    id: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    createdAt: string;
}

// Full listing response (camelCase matching backend)
export interface Listing {
    id: string;
    sellerId: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category: Category;
    size: string;
    brand: string | null;
    condition: Condition;
    color: string | null;
    status: ListingStatus;
    images: ListingImage[];
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    seller: ListingSeller;
}

// Pagination metadata
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// --- Requests ---

export interface CreateListingRequest {
    title: string;
    description: string;
    price: number;
    category: Category;
    size: string;
    brand?: string;
    condition: Condition;
    color?: string;
    status?: ListingStatus;
    images: File[];
}

export interface UpdateListingRequest {
    title?: string;
    description?: string;
    price?: number;
    category?: Category;
    size?: string;
    brand?: string;
    condition?: Condition;
    color?: string;
    status?: ListingStatus;
}

export interface UpdateListingStatusRequest {
    status: ListingStatus;
}

export interface ListingFilters {
    category?: Category;
    condition?: Condition;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    brand?: string;
    color?: string;
    search?: string;
    status?: ListingStatus;
    sortBy?: 'createdAt' | 'price' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// --- Responses (matching backend shape) ---

export interface CreateListingResponse {
    ok: boolean;
    message: string;
    listing: Listing;
}

export interface GetListingsResponse {
    ok: boolean;
    items: Listing[];
    pagination: Pagination;
}

export interface GetListingResponse {
    ok: boolean;
    item: Listing;
}

export interface UpdateListingResponse {
    ok: boolean;
    message: string;
    listing: Listing;
}

export interface DeleteListingResponse {
    ok: boolean;
    message: string;
}

export interface UpdateStatusResponse {
    ok: boolean;
    message: string;
    listing: Listing;
}