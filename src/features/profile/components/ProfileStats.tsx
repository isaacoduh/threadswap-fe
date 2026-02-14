import { Package, ShoppingBag, Star } from "lucide-react";
import type { ProfileStats as ProfileStatsType } from "../types";

interface ProfileStatsProps {
  stats: ProfileStatsType;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { label: "Listings", value: stats.listingsCount, icon: Package },
    { label: "Sales", value: stats.salesCount, icon: ShoppingBag },
    {
      label: "Rating",
      value: stats.ratingCount > 0 ? stats.avgRating.toFixed(1) : "—",
      icon: Star,
      sub: stats.ratingCount > 0 ? `(${stats.ratingCount})` : null,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4"
        >
          <item.icon className="h-5 w-5 text-muted-foreground" />
          <p className="text-xl font-bold">
            {item.value}
            {item.sub && (
              <span className="ml-1 text-xs font-normal text-muted-foreground">{item.sub}</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}