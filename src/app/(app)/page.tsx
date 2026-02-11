"use client";

import { useRouter } from "next/navigation";
import { HeroBanner } from "@/features/home/components/HeroBanner";
import { CategoryChips } from "@/features/home/components/CategoryChips";
import { ListingSection } from "@/features/home/components/ListingSection";
import { useListings } from "@/features/listings/hooks/useListings";

export default function HomePage() {
  const router = useRouter();

  // Recent listings — newest first
  const { data: recentData, isLoading: recentLoading } = useListings({
    status: "ACTIVE",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 6,
  });

  // Trending — most viewed
  const { data: trendingData, isLoading: trendingLoading } = useListings({
    status: "ACTIVE",
    sortBy: "price",
    sortOrder: "desc",
    limit: 6,
  });

  return (
    <div className="pb-10">
      {/* Hero */}
      <HeroBanner />

      {/* Categories */}
      <CategoryChips />

      {/* Recent Listings */}
      <ListingSection
        title="Just dropped"
        emoji="🔥"
        href="/search?sortBy=created_at&sortOrder=desc"
        listings={recentData?.items || []}
        isLoading={recentLoading}
      />

      {/* Trending */}
      <ListingSection
        title="Trending now"
        emoji="⚡"
        href="/search?sortBy=price&sortOrder=desc"
        listings={trendingData?.items || []}
        isLoading={trendingLoading}
      />

      {/* Bottom CTA */}
      <section className="mx-4 mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-center text-white">
        <p className="text-2xl font-extrabold leading-tight">
          Got clothes collecting dust?
        </p>
        <p className="mt-1 text-sm text-white/80">
          Turn them into cash in minutes.
        </p>
        <button
          onClick={() => router.push("/listings/create")}
          className="mt-4 inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-emerald-700 shadow-lg transition-transform active:scale-95"
        >
          List your first item
        </button>
      </section>
    </div>
  );
}