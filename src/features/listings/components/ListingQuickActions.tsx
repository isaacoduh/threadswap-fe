"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, CheckCircle, Archive, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDeleteListing, useUpdateListingStatus } from "@/features/listings/hooks/useListings";
import type { ListingStatus } from "@/features/listings/types";


interface ListingQuickActionsProps {
  listingId: string;
  currentStatus: ListingStatus;
}

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  hidden?: boolean;
}

export function ListingQuickActions({
    listingId,
    currentStatus,
}: ListingQuickActionsProps) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const {mutate: deleteListing, isPending: isDeleting} = useDeleteListing()
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateListingStatus();

    const isPending = isDeleting || isUpdating;

    // close on outside click
    useEffect(() => {
        if(!open) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)){
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open]);

    const handleStatusChange = (status: ListingStatus) => {
        updateStatus(
            {id: listingId, payload: {status}},
            {onSettled: () => setOpen(false)}
        );
    };

    const handleDelete = () => {
        if(!confirm("Are you sure you want to delete this listing")) return;
        deleteListing(listingId, {onSettled: () => setOpen(false)});
    }


    const actions: ActionItem[] = [
    {
      label: "View listing",
      icon: <Eye className="h-4 w-4" />,
      href: `/listings/${listingId}`,
    },
    {
      label: "Edit listing",
      icon: <Pencil className="h-4 w-4" />,
      href: `/listings/${listingId}/edit`,
    },
    {
      label: "Mark as sold",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => handleStatusChange("SOLD"),
      hidden: currentStatus === "SOLD" || currentStatus === "DRAFT",
    },
    {
      label: "Publish",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => handleStatusChange("ACTIVE"),
      hidden: currentStatus !== "DRAFT",
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      onClick: () => handleStatusChange("ARCHIVED"),
      hidden: currentStatus === "ARCHIVED" || currentStatus === "SOLD",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const visibleActions = actions.filter((a) => !a.hidden);

  return (
    <div ref={menuRef} className="relative">
        <button type="button" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev)
        }}
        disabled={isPending}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          "hover:bg-muted/80 active:bg-muted",
          open && "bg-muted"
        )}
        aria-label="Listing actions"
        >
            <MoreHorizontal  className="h-4 w-4"/>
        </button>

        {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          {visibleActions.map((action) => {
            const className = cn(
              "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
              action.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10"
                : "hover:bg-muted"
            );

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  {action.icon}
                  {action.label}
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                disabled={isPending}
                className={className}
              >
                {action.icon}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  )
}