"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  MessageCircle,
  Bell,
  Menu,
  X,
  Plus,
  LogOut,
  User,
  Settings,
  ChevronDown,
  ShoppingBag,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CATEGORIES } from "@/features/listings/schemas/listing.schema";

// ─── User Menu ───────────────────────────────────────────────

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

  const displayName =
    (user as any)?.displayName ||
    (user as any)?.fullName ||
    (user as any)?.username ||
    null;
  const email = user?.email || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email?.[0]?.toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
          "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
          "hover:shadow-md active:scale-95",
          open && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold">
              {displayName || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/sell"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <Package className="h-4 w-4 text-muted-foreground" />
            My Listings
          </Link>
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            Orders
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </Link>

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

// ─── Category Dropdown ───────────────────────────────────────

function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative hidden md:block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-muted",
          open && "bg-muted"
        )}
      >
        Categories
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 grid min-w-[320px] grid-cols-2 gap-1 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                router.push(`/search?category=${cat.value}`);
                setOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Icon Button ─────────────────────────────────────────────

function NavIconButton({
  href,
  icon: Icon,
  label,
  badge,
  className,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted",
        className
      )}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

// ─── Mobile Menu ─────────────────────────────────────────────

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayName =
    (user as any)?.displayName ||
    (user as any)?.fullName ||
    (user as any)?.username ||
    null;
  const email = user?.email || "";

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-lg font-bold">Menu</span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
              {displayName?.[0]?.toUpperCase() ||
                email?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {displayName || "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Sell CTA (mobile) */}
        <div className="border-b border-border px-4 py-3">
          <Link
            href="/listings/create"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Sell an item
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <MobileNavLink href="/" icon={Search} label="Browse" onClick={onClose} />
          <MobileNavLink
            href="/sell"
            icon={Package}
            label="My Listings"
            onClick={onClose}
          />
          <MobileNavLink
            href="/favourites"
            icon={Heart}
            label="Favourites"
            onClick={onClose}
          />
          <MobileNavLink
            href="/messages"
            icon={MessageCircle}
            label="Messages"
            onClick={onClose}
          />
          <MobileNavLink
            href="/notifications"
            icon={Bell}
            label="Notifications"
            onClick={onClose}
          />

          {/* Categories */}
          <div className="my-2 border-t border-border" />
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                router.push(`/search?category=${cat.value}`);
                onClose();
              }}
              className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
            >
              {cat.label}
            </button>
          ))}

          <div className="my-2 border-t border-border" />
          <MobileNavLink
            href="/profile"
            icon={User}
            label="Profile"
            onClick={onClose}
          />
          <MobileNavLink
            href="/settings"
            icon={Settings}
            label="Settings"
            onClick={onClose}
          />
        </nav>

        {/* Bottom logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted",
        isActive && "font-semibold text-primary"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      {label}
    </Link>
  );
}

// ─── Main Header ─────────────────────────────────────────────

export function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-lg font-extrabold tracking-tight">
              Thread<span className="text-primary">Swap</span>
            </span>
          </Link>

          {/* Category dropdown (desktop) */}
          <CategoryDropdown />

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden flex-1 sm:block"
          >
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for brands, items, styles..."
              className="h-10 w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Sell CTA (desktop) */}
            <Link
              href="/listings/create"
              className="mr-2 hidden items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Sell
            </Link>

            {/* Icon buttons (desktop) */}
            <div className="hidden items-center gap-0.5 sm:flex">
              <NavIconButton href="/favourites" icon={Heart} label="Favourites" />
              <NavIconButton
                href="/messages"
                icon={MessageCircle}
                label="Messages"
              />
              <NavIconButton
                href="/notifications"
                icon={Bell}
                label="Notifications"
              />
            </div>

            {/* User menu (desktop) */}
            <div className="ml-1 hidden sm:block">
              <UserMenu />
            </div>

            {/* Mobile: search + hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted sm:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="border-t border-border px-4 py-2 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search ThreadSwap..."
              className="h-10 w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}