"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { FeedListingCard } from "./FeedListingCard";
import type { Listing } from "@/features/listings/types";


interface ListingSectionProps {
    title: string;
    emoji?: string;
    href?: string;
    listings: Listing[];
    isLoading?: boolean;
}

export function ListingSection({
    title, emoji, href, listings, isLoading
}: ListingSectionProps) {
    if(isLoading) {
        return (
            <section className="mt-8">
                <div className="mb-3 flex items-center justify-between px-4">
                    <h3 className="text-base font-bold">
                        {emoji && <span className="mr-1.5">{emoji}</span>}
                        {title}
                    </h3>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </section>
        );
    }

    if (!listings.length) return null;

    return (
        <section className="mt-8">
            <div className="mb-3 flex items-center justify-between px-4">
                <h3 className="text-base font-bold">
                {emoji && <span className="mr-1.5">{emoji}</span>}
                {title}
                </h3>
                {href && (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-sm font-semibold text-primary"
                >
                    See all
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
                {listings.map((listing) => (
                <FeedListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </section>
    );
}