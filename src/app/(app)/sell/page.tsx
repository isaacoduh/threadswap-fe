"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserListings } from "@/features/listings/hooks/useListings";
import { ListingCard } from "@/features/listings/components/ListingCard";
import { ListingRow } from "@/features/listings/components/ListingRow";
import { EmptyListings } from "@/features/listings/components/EmptyListings";
import type { ListingStatus, ListingFilters } from "@/features/listings/types";

type StatusTab = "ALL" | ListingStatus;
type SortOption = "createdAt" | "price" | "title";
type ViewMode = "grid" | "list";

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "SOLD", label: "Sold" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "title", label: "Title" },
];

export default function SellPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSort, setShowSort] = useState(false);

  // Build filters from current UI state
  const filters: ListingFilters = useMemo(() => {
    const f: ListingFilters = {
      sortBy,
      sortOrder,
      limit: 50,
    };
    if (activeTab !== "ALL") f.status = activeTab as ListingStatus;
    if (searchQuery.trim()) f.search = searchQuery.trim();
    return f;
  }, [activeTab, searchQuery, sortBy, sortOrder]);

  const { user } = useAuth();

  // Fetch only the current user's listings
  const { data, isLoading, error } = useUserListings(user?.id || "", filters);

  const listings = data?.items || [];
  const total = data?.pagination?.total || 0;

  // Count per status (from ALL query) — for tab badges
  // In production you'd get these from a dedicated endpoint or aggregate
  const tabCount = (tab: StatusTab) => {
    if (tab === "ALL") return total;
    return undefined; // Only show count on All tab for now
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">My Listings</h1>
          <Link href="/listings/create">
            <Button size="sm" className="gap-1.5 rounded-xl">
              <Plus className="h-4 w-4" />
              Sell
            </Button>
          </Link>
        </div>

        {/* Status tabs */}
        <div className="scrollbar-none flex gap-1 overflow-x-auto px-4 pb-3">
          {STATUS_TABS.map((tab) => {
            const count = tabCount(tab.value);
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
                {count !== undefined && (
                  <span
                    className={cn(
                      "ml-1.5 text-xs",
                      activeTab === tab.value
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Toolbar: Search + Sort + View toggle */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl pl-9 text-sm"
            />
          </div>

          {/* Sort toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSort((prev) => !prev)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors",
                showSort
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              aria-label="Sort options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {/* Sort dropdown */}
            {showSort && (
              <div className="absolute right-0 top-full z-20 mt-1.5 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (sortBy === opt.value) {
                        toggleSortOrder();
                      } else {
                        setSortBy(opt.value);
                        setSortOrder("desc");
                      }
                      setShowSort(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                      sortBy === opt.value && "font-semibold text-primary"
                    )}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <span className="text-xs text-muted-foreground">
                        {sortOrder === "desc" ? "↓" : "↑"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-xl border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex h-10 w-10 items-center justify-center transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex h-10 w-10 items-center justify-center border-l border-border transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Loading listings...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-sm font-medium">Failed to load listings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && listings.length === 0 && (
          <EmptyListings status={activeTab} />
        )}

        {/* Grid view */}
        {!isLoading && !error && listings.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* List view */}
        {!isLoading && !error && listings.length > 0 && viewMode === "list" && (
          <div className="space-y-2">
            {listings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}