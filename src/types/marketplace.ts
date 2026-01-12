export interface Product {
    id: string;
    title: string;
    brand: string;
    price: number;
    size: string;
    condition: "New" | "Like New" | "Good" | "Fair";
    category: string;
    images: string[];
    description: string;
    seller: {
        id: string;
        name: string;
        avatar: string;
        rating: number;
        responseTime: string;
        memberSince: string;
        itemsSold: number;
        reviews: number
    };
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    isOwn: boolean;
    image?: string;
}

export interface Conversation {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    product?: {
        id: string;
        title: string;
        image: string;
        price: number;
    }
}

export type Category = {id: string; label: string}