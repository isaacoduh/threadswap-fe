// --- Profile shape (public-safe) ---

export interface ProfileAvatar {
    key: string;
    url: string;
}

export interface ProfileSocials {
    instagram?: string;
    website?: string;
}

export interface ProfileStats {
    listingsCount: number;
    salesCount: number;
    avgRating: number;
    ratingCount: number;
}

export interface UserProfile {
    id: string;
    displayName: string | null;
    username: string | null;
    bio: string | null;
    avatar: ProfileAvatar | null;
    socials: ProfileSocials | null;
    stats: ProfileStats;
    createdAt: string;
}

// --- Requests
export interface PatchProfileRequest {
    displayName?: string;
    username?: string;
    bio?: string;
    socials?: ProfileSocials
}

// --- Responses
export interface GetProfileResponse {
    ok: boolean;
    profile: UserProfile
}

export interface PatchProfileResponse {
    ok: boolean
    profile: UserProfile
}

export interface UploadAvatarResponse {
    ok: boolean;
    avatar: ProfileAvatar
}