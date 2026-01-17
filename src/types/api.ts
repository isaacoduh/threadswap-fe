/**
 * Common API Primitives
 */
export type ISODateString = string;

export type PaginatedResponse<T> = {
    results: T[];
    count: number;
    next?: string | null;
    previous?: string | null;
}

/**
 * USER
 * Minimal: identify + display fields
 */
export type User = {
    id: string;
    email: string;
    username?: string | null;

    firstName?: string | null;
    lastName?: string | null;

    avatarUrl?: string | null;

    createdAt?: ISODateString;
    updatedAt?: ISODateString;
}

/**
 * LISTING
 */
export type ListingCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

export type ListingImage = {
    id: string;
    url: string;
    order?: number;
}

export type Listing = {
    id: string;

    title: string;
    description?: string | null;

    price: number;
    currency?: string;


    brand?: string | null;
    category?: string | null;
    size?: string | null;

    condition: ListingCondition;

    images: ListingImage[];

    seller: Pick<User, "id" | "username" | "firstName" | "lastName" | "avatarUrl" >;

    isSold?: boolean;
    createdAt?: ISODateString
    updatedAt?: ISODateString
}

/**
 * MESSAGE
 */
export type MessageAttachment = {
    id: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    url: string;
}

export type Message = {
    id: string;
    conversationId: string;

    senderId: string;
    recipientId?: string;

    text?: string | null;
    attachments?: MessageAttachment[];

    createdAt: ISODateString;
    readAt?: ISODateString | null;
}

/**
 * TRANSACTION
 * Keep generic; refine once your ledger rules are final.
 */
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type TransactionType = "PAYMENT" | "PAYOUT" | "REFUND" | "FEE" | "OTHER";


export type Transaction = {
    id?: string;
    
    type?: TransactionType;
    status: TransactionStatus;

    amount: number;
    currency: string;

    // references
    buyerId?: string | null;
    sellerId?: string | null;
    listingId?: string | null;


    // optional 
    provider?: string | null; // "stripe", etc.
    providerRef?: string | null;

    createdAt: ISODateString;
    updatedAt?: ISODateString;
}