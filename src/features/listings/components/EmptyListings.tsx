"use client";

import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyListingsProps {
  status?: string;
}

const EMPTY_MESSAGES: Record<string, { title: string; description: string }> = {
  ALL: {
    title: "No listings yet",
    description: "Start selling by creating your first listing.",
  },
  ACTIVE: {
    title: "No active listings",
    description: "Publish a draft or create a new listing to start selling.",
  },
  DRAFT: {
    title: "No drafts",
    description: "Drafts you save while creating listings will appear here.",
  },
  SOLD: {
    title: "No sold items yet",
    description: "Items you've sold will appear here.",
  },
  ARCHIVED: {
    title: "No archived listings",
    description: "Listings you archive will appear here.",
  },
};

export function EmptyListings({ status = "ALL" }: EmptyListingsProps) {
  const content = EMPTY_MESSAGES[status] || EMPTY_MESSAGES.ALL;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{content.title}</h3>
      <p className="mb-6 max-w-[260px] text-sm text-muted-foreground">
        {content.description}
      </p>
      <Link href="/listings/create">
        <Button className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          Create Listing
        </Button>
      </Link>
    </div>
  );
}