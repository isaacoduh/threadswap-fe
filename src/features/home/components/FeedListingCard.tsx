"use client"
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getListingImageUrl } from "@/features/listings/utils/image";
import type { Listing } from "@/features/listings/types";

interface FeedListingCardProps {
  listing: Listing;
}

export function FeedListingCard({listing}: FeedListingCardProps) {
    const imageUrl = getListingImageUrl(listing.images?.[0])
    const sellerName = listing.seller?.displayName || listing.seller?.username || "Seller"

    return (
        <Link
            href={`/listings/${listing.id}`}
            className="group block overflow-hidden rounded-2xl bg-card transition-shadow hover:shadow-lg active:scale-[0.98]"
        >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image 
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-sm text-muted-foreground">
                        No image
                    </div>
                )}

                {/* Favorite button */}
                <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: wire up save/unsave
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:bg-card hover:scale-110 active:scale-95"
                aria-label="Save listing"
                >
                    <Heart className="h-4 w-4" />
                </button>

                {/* Price Pill */}
                 <div className="absolute bottom-2 left-2 rounded-lg bg-card/90 px-2.5 py-1 text-sm font-bold shadow-sm backdrop-blur-sm">
                    £{parseFloat(listing.price).toFixed(0)}
                </div>

                {/* Info */}
                <div className="p-2.5">
                    <p className="truncate text-sm font-semibold leading-tight">
                        {listing.title}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                        <p className="truncate text-xs text-muted-foreground">
                            {listing.brand} · {listing.size}
                        </p>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground/70">
                        {sellerName}
                    </p>
                </div>
            </div>
        </Link>
    )
}