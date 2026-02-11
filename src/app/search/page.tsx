"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { FeedListingCard } from "@/features/home/components/FeedListingCard";
import { SearchFilters } from "@/features/search/components/SearchFilters";
import { EmptySearch } from "@/features/search/components/EmptySearch";
import { useListings } from "@/features/listings/hooks/useListings";
import type { ListingFilters, Category, Condition } from "@/features/listings/types";

const ITEMS_PER_PAGE = 20;

// Parse URL search params into ListingFilters
function parseFiltersFromURL(params: URLSearchParams): ListingFilters {
  const filters: ListingFilters = {
    status: "ACTIVE",
    limit: ITEMS_PER_PAGE,
  };

  const q = params.get("q");
  const category = params.get("category");
  const condition = params.get("condition");
  const size = params.get("size");
  const brand = params.get("brand");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  const page = params.get("page");

  if (q) filters.search = q;
  if (category) filters.category = category as Category;
  if (condition) filters.condition = condition as Condition;
  if (size) filters.size = size;
  if (brand) filters.brand = brand;
  if (minPrice) filters.minPrice = Number(minPrice);
  if (maxPrice) filters.maxPrice = Number(maxPrice);
  if (sortBy && ["created_at", "price", "title"].includes(sortBy)) {
    filters.sortBy = sortBy as ListingFilters["sortBy"];
  }
  if (sortOrder && ["asc", "desc"].includes(sortOrder)) {
    filters.sortOrder = sortOrder as "asc" | "desc";
  }
  if (page) filters.page = Number(page);

  return filters;
}

// Convert ListingFilters back to URL params
function filtersToURLParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.size) params.set("size", filters.size);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sortBy && filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
  if (filters.sortOrder && filters.sortOrder !== "desc") params.set("sortOrder", filters.sortOrder);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from URL
  const [filters, setFilters] = useState<ListingFilters>(() =>
    parseFiltersFromURL(searchParams)
  );

  // Sync URL when filters change
  const updateURL = useCallback(
    (newFilters: ListingFilters) => {
      const params = filtersToURLParams(newFilters);
      const search = params.toString();
      router.replace(`/search${search ? `?${search}` : ""}`, { scroll: false });
    },
    [router]
  );

  const handleFilterChange = useCallback(
    (newFilters: ListingFilters) => {
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [updateURL]
  );

  const handleClearFilters = useCallback(() => {
    const cleared: ListingFilters = { status: "ACTIVE", limit: ITEMS_PER_PAGE };
    setFilters(cleared);
    updateURL(cleared);
  }, [updateURL]);

  // Sync from URL on popstate (browser back/forward)
  useEffect(() => {
    setFilters(parseFiltersFromURL(searchParams));
  }, [searchParams]);

  // Fetch listings
  const apiFilters = useMemo(
    () => ({ ...filters, status: "ACTIVE" as const, limit: ITEMS_PER_PAGE }),
    [filters]
  );
  const { data, isLoading, error } = useListings(apiFilters);

  const listings = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = filters.page || 1;

  // Check if any user-facing filters are active
  const hasFilters = !!(
    filters.category ||
    filters.condition ||
    filters.size ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice
  );

  const activeFilterCount = [
    filters.category,
    filters.condition,
    filters.size,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <>
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {filters.search ? (
                <>
                  Results for &ldquo;{filters.search}&rdquo;
                </>
              ) : filters.category ? (
                filters.category.charAt(0) + filters.category.slice(1).toLowerCase()
              ) : (
                "Browse all"
              )}
            </h1>
            {pagination && (
              <p className="mt-1 text-sm text-muted-foreground">
                {pagination.total} item{pagination.total !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* Mobile filter trigger */}
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            className="gap-2 rounded-xl lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar (desktop) + slide-over (mobile) */}
          <SearchFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1">
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Searching...
                </p>
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-sm font-medium">Something went wrong</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please try again later.
                </p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && listings.length === 0 && (
              <EmptySearch
                query={filters.search}
                hasFilters={hasFilters}
                onClearFilters={handleClearFilters}
              />
            )}

            {/* Results grid */}
            {!isLoading && !error && listings.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {listings.map((listing) => (
                    <FeedListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        handleFilterChange({ ...filters, page: currentPage - 1 })
                      }
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() =>
                              handleFilterChange({ ...filters, page: pageNum })
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        handleFilterChange({ ...filters, page: currentPage + 1 })
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}