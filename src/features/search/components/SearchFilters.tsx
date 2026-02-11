"use client"

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CONDITIONS, SIZES } from "@/features/listings/schemas/listing.schema";
import type { ListingFilters, Category, Condition } from "@/features/listings/types";


interface SearchFiltersProps {
    filters: ListingFilters;
    onChange: (filters: ListingFilters) => void;
    onClear: () => void;

    // Mobile: show as overlay
    open?: boolean;
    onClose?: () => void;
}

type SortOption = {
    label: string;
    sortBy: "createdAt" | "price" | "title";
    sortOrder: "asc" | "desc"
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Price: Low → High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High → Low", sortBy: "price", sortOrder: "desc" },
  { label: "A → Z", sortBy: "title", sortOrder: "asc" },
];

function FilterSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode
}) {
    return (
        <div>
            <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
            </h4>
            {children}
        </div>
    )
}

function ChipSelect({options, value, onSelect}: {
    options: {value: string; label: string}[];
    value?: string;
    onSelect: (val: string | undefined) => void;
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => (
                <button key={opt.value} type="button" onClick={() => onSelect(value === opt.value ? undefined : opt.value)} className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    value === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}>
                    {opt.label}
                </button>
            ) )}
        </div>
    )
}

function FilterContent({filters, onChange, onClear}: Omit<SearchFiltersProps, "open" | "onClose">) {
    const activeCount = [
        filters.category,
        filters.condition,
        filters.size,
        filters.minPrice,
        filters.maxPrice,
        filters.brand
    ].filter(Boolean).length

    const currentSort = SORT_OPTIONS.find(
        (o) => o.sortBy === (filters.sortBy || "createdAt") && o.sortOrder === (filters.sortOrder || "desc")
    );

    return (
        <div className="space-y-6">
            {/* Active filter count + clear */}
            {activeCount > 0 && (
                <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    {activeCount} filter{activeCount !== 1 ? "s" : ""} active
                </span>
                <button
                    onClick={onClear}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Clear all
                </button>
                </div>
            )}

            {/* Sort */}
            <FilterSection title="Sort by">
                <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                    <button
                    key={opt.label}
                    onClick={() =>
                        onChange({ ...filters, sortBy: opt.sortBy, sortOrder: opt.sortOrder })
                    }
                    className={cn(
                        "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        currentSort?.label === opt.label
                        ? "bg-primary/10 font-semibold text-primary"
                        : "hover:bg-muted"
                    )}
                    >
                    {opt.label}
                    </button>
                ))}
                </div>
            </FilterSection>

            {/* Category */}
      <FilterSection title="Category">
        <ChipSelect
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          value={filters.category}
          onSelect={(val) => onChange({ ...filters, category: val as Category | undefined, page: 1 })}
        />
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <ChipSelect
          options={CONDITIONS.map((c) => ({ value: c.value, label: c.label }))}
          value={filters.condition}
          onSelect={(val) => onChange({ ...filters, condition: val as Condition | undefined, page: 1 })}
        />
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <ChipSelect
          options={SIZES.map((s) => ({ value: s, label: s }))}
          value={filters.size}
          onSelect={(val) => onChange({ ...filters, size: val, page: 1 })}
        />
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Price range">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              £
            </span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
              className="h-10 w-full rounded-lg border border-border bg-background pl-7 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              min={0}
            />
          </div>
          <span className="text-sm text-muted-foreground">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              £
            </span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
              className="h-10 w-full rounded-lg border border-border bg-background pl-7 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              min={0}
            />
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <input
          type="text"
          placeholder="Search by brand..."
          value={filters.brand ?? ""}
          onChange={(e) =>
            onChange({ ...filters, brand: e.target.value || undefined, page: 1 })
          }
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </FilterSection>
        </div>
    )
}


export function SearchFilters({
  filters,
  onChange,
  onClear,
  open,
  onClose,
}: SearchFiltersProps) {
  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Filters</h3>
          <FilterContent filters={filters} onChange={onChange} onClear={onClear} />
        </div>
      </aside>

      {/* Mobile: slide-over panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-card shadow-2xl lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterContent filters={filters} onChange={onChange} onClear={onClear} />
            </div>
            <div className="border-t border-border p-4">
              <Button
                onClick={onClose}
                className="w-full rounded-xl py-5 font-semibold"
              >
                Show results
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}