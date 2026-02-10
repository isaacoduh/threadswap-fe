// src/components/layout/Header.tsx

"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal, User, LogOut, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // const initials = user?.fullName
  //   ? user.fullName
  //       .split(" ")
  //       .map((n) => n[0])
  //       .join("")
  //       .toUpperCase()
  //       .slice(0, 2)
  //   : user?.email?.[0]?.toUpperCase() || "U";
  const initials = user?.email?.[0]?.toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
          "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm",
          "hover:shadow-md active:scale-95",
          open && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          {/* User info */}
          <div className="border-b border-border px-4 py-3">
            {/* <p className="truncate text-sm font-semibold">
              {user?.fullName || "User"}
            </p> */}
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>

          {/* Menu items */}
          {/* <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </Link> */}

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

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

        {/* Right: filters (search variant) */}
        {variant === "search" && (
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            className="h-11 w-11 shrink-0 rounded-xl border-border bg-transparent"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        )}

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}