"use client";

import { useUserListings } from "@/features/listings/hooks/useListings";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { EmptyListings } from "@/features/listings/components/EmptyListings";
import { Loader2 } from "lucide-react";

interface ProfileListingsProps {
  userId: string;
  isOwner: boolean;
}

export function ProfileListings({ userId, isOwner }: ProfileListingsProps) {
  const { data, isLoading } = useUserListings(userId, {
    status: isOwner ? undefined : "ACTIVE",
  });

  const listings = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!listings.length) {
    return <EmptyListings />;
  }

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {isOwner ? "Your Listings" : "Listings"}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}