export type Category = 'TOPS' | 'BOTTOMS' | 'DRESSES' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORIES' | 'BAGS' | 'JEWELRY' | 'OTHER';
export type Condition = 'NEW_WITH_TAGS' | 'NEW_WITHOUT_TAGS' | 'EXCELLENT' | 'GOOD' | 'FAIR';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED' | 'REMOVED';


export interface ListingSeller {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

export interface Listing {
    id: string;
    seller_id: string;
    title: string;
    description: string;
    price: string;
    category: Category;
    size: string;
    brand: string | null;
    condition: Condition;
    color: string | null;
    status: ListingStatus;
    images: []
    view_count: number;
    created_at: string;
    updated_at: string;
    seller: ListingSeller
}

// pagination meta data
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


// Request
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
    images: File[]
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
    status?: ListingStatus
    sortBy?: 'created_at' | 'price' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}


// --- Responses
export interface CreateListingResponse {
    message: string;
    listing: Listing;
}


export interface GetListingsResponse {
    listing: Listing[];
    pagination: Pagination;
}

export interface GetListingResponse {
    listing: Listing;
}

export interface UpdateListingResponse {
    message: string;
    listing: Listing
}

export interface DeleteListingResponse {
    message: string;
}

export interface UpdateStatusResponse {
    messagE: string;
    listing: Listing
}