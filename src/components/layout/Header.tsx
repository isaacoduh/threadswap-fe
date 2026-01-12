// src/components/layout/Header.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeaderVariant = "search" | "simple";

export type HeaderProps = {
  variant?: HeaderVariant;

  // Search variant
  onFilterClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Simple variant
  title?: string;
  rightSlot?: React.ReactNode;

  className?: string;
};

export function Header({
  variant = "search",
  onFilterClick,
  searchValue,
  onSearchChange,
  title,
  rightSlot,
  className,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-lg items-center gap-2 px-4 py-3">
        {/* Left: brand/home */}
        <Link href="/" className="shrink-0">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            ThreadSwap
          </span>
        </Link>

        {/* Center: variant content */}
        {variant === "search" ? (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={
                pathname === "/search"
                  ? "Search for brands, items..."
                  : "Search ThreadSwap..."
              }
              className="h-11 rounded-xl border-0 bg-secondary pl-10 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">{title ?? ""}</h1>
            {rightSlot}
          </div>
        )}

        {/* Right: filters (search) or empty */}
        {variant === "search" ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            className="h-11 w-11 shrink-0 rounded-xl border-border bg-transparent"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
