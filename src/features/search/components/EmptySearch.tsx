"use client"

import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptySearchProps {
  query?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptySearch({query, hasFilters, onClearFilters}: EmptySearchProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>

            {query ? (
                <>
                    <h3 className="mb-1 text-lg font-semibold">
                        No results for &ldquo;{query}&rdquo;
                    </h3>
                    <p className="mb-6 max-w-[300px] text-sm text-muted-foreground">
                        Try a different search term, remove some filters, or browse all listings.
                    </p>
                </>
            ) : (
                <>
                    <h3 className="mb-1 text-lg font-semibold">No listings found</h3>
                    <p className="mb-6 max-w-[300px] text-sm text-muted-foreground">
                        {hasFilters
                        ? "No items match your current filters. Try broadening your search."
                        : "There are no active listings right now. Check back soon!"}
                    </p>
                </>
            )}

            <div className="flex gap-3">
                {hasFilters && onClearFilters && (
                    <Button variant="outline" onClick={onClearFilters} className="rounded-xl">Clear all filters</Button>
                )}
                <Link href="/">
                    <Button variant="outline" className="rounded-xl">
                        Back to home..
                    </Button>
                </Link>
            </div>
        </div>
    )
}