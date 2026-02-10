"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingQuickActions } from "./ListingQuickActions";
import { getListingImageUrl } from "@/features/listings/utils/image";
import type { Listing } from "@/features/listings/types";
import { Eye } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  DRAFT: "bg-amber-500",
  SOLD: "bg-blue-500",
  ARCHIVED: "bg-muted-foreground",
  REMOVED: "bg-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  SOLD: "Sold",
  ARCHIVED: "Archived",
  REMOVED: "Removed",
};

interface ListingRowProps {
  listing: Listing;
}

export function ListingRow({ listing }: ListingRowProps) {
  const dot = STATUS_DOT[listing.status] || STATUS_DOT.ACTIVE;
  const label = STATUS_LABEL[listing.status] || listing.status;
  const imageUrl = getListingImageUrl(listing.images?.[0]);
  const createdDate = new Date(listing.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      {/* Thumbnail */}
      <Link
        href={`/listings/${listing.id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className={cn(
              "object-cover",
              listing.status === "SOLD" && "opacity-60"
            )}
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Link href={`/listings/${listing.id}`}>
          <p className="truncate font-semibold leading-tight hover:underline">
            {listing.title}
          </p>
        </Link>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {listing.brand} · Size {listing.size} · {listing.condition?.replace(/_/g, " ")}
        </p>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className={cn("inline-block h-2 w-2 rounded-full", dot)} />
            {label}
          </span>
          <span>{createdDate}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {listing.viewCount}
          </span>
        </div>
      </div>

      {/* Price + Actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-lg font-bold">£{parseFloat(listing.price).toFixed(2)}</span>
        <ListingQuickActions
          listingId={listing.id}
          currentStatus={listing.status}
        />
      </div>
    </div>
  );
}