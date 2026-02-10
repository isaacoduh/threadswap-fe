"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingQuickActions } from "./ListingQuickActions";
import type { Listing } from "@/features/listings/types";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/10 text-emerald-600" },
  DRAFT: { label: "Draft", className: "bg-amber-500/10 text-amber-600" },
  SOLD: { label: "Sold", className: "bg-blue-500/10 text-blue-600" },
  ARCHIVED: { label: "Archived", className: "bg-muted text-muted-foreground" },
  REMOVED: { label: "Removed", className: "bg-destructive/10 text-destructive" },
};

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
}

// Get the first displayable image URL
function getImageUrl(listing: Listing): string | null {
  const img = listing.images?.[0];
  if (!img) return null;
  return img.url || null;
}

export function ListingCard({ listing, showActions = true }: ListingCardProps) {
  const badge = STATUS_BADGE[listing.status] || STATUS_BADGE.ACTIVE;
  const imageUrl = getImageUrl(listing);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                listing.status === "SOLD" && "opacity-60"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}

          {/* Status badge */}
          <span
            className={cn(
              "absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-semibold",
              badge.className
            )}
          >
            {badge.label}
          </span>

          {/* SOLD overlay */}
          {listing.status === "SOLD" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-lg bg-foreground/70 px-4 py-1.5 text-sm font-bold tracking-wider text-background">
                SOLD
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              {listing.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {listing.brand} · Size {listing.size}
            </p>
          </div>
          {showActions && (
            <ListingQuickActions
              listingId={listing.id}
              currentStatus={listing.status}
            />
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold">£{parseFloat(listing.price).toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">
            {listing.viewCount} view{listing.viewCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}