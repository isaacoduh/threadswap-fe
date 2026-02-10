"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 p-6 text-white">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-8 h-16 w-16 rotate-12 rounded-xl bg-yellow-300/20 blur-xl" />

      <div className="relative z-10">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          New on ThreadSwap
        </div>

        <h2 className="mb-1 text-2xl font-extrabold leading-tight tracking-tight">
          Your wardrobe
          <br />
          deserves a second life
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-white/80">
          Sell what you don&apos;t wear. Find what you&apos;ll love.
        </p>

        <div className="flex gap-3">
          <Link
            href="/listings/create"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition-transform active:scale-95"
          >
            Start Selling
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-transform active:scale-95"
          >
            Browse
          </Link>
        </div>
      </div>
    </section>
  );
}