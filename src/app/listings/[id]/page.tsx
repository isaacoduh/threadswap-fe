"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  ShieldCheck,
  Eye,
  Clock,
  Pencil,
  Trash2,
  CheckCircle,
  Archive,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useListing, useDeleteListing, useUpdateListingStatus } from "@/features/listings/hooks/useListings";
import { getListingImageUrl } from "@/features/listings/utils/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CATEGORIES, CONDITIONS } from "@/features/listings/schemas/listing.schema";
import type { ListingStatus } from "@/features/listings/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// ----- Image Gallery

function ImageGallery({images, title}: {images: {key: string, url: string | null}[]; title: string}) {
    const [activeIndex, setActiveIndex] = useState(0)
    const urls = images.map((img) => getListingImageUrl(img)).filter(Boolean) as string [];

    if(!urls.length) {
        return (
            <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
                No images
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={urls[activeIndex]}
                    alt={`${title} - Photo ${activeIndex + 1}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                 />

                 {/* Nav arrows */}
                 {urls.length > 1 && (
                    <>
                        <button 
                            onClick={() => setActiveIndex((i) => (i === 0 ? urls.length - 1 : i - 1))}
                            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm transition-all hover:bg-card active:scale-95"
                            aria-label="Previous image"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={() => setActiveIndex((i) => (i === urls.length - 1 ? 0 : i + 1))}
                            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm transition-all hover:bg-card active:scale-95"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                 )}

                 {/* Dot indicators */}
                {urls.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {urls.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                        "h-2 rounded-full transition-all",
                        i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                        )}
                        aria-label={`View image ${i + 1}`}
                    />
                    ))}
                </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {urls.length > 1 && (
                <div className="flex gap-2 p-3">
                {urls.map((url, i) => (
                    <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                        "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all",
                        i === activeIndex
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "opacity-60 hover:opacity-100"
                    )}
                    >
                    <Image src={url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                ))}
                </div>
            )}
        </div>
    )
}

// ─── Owner Actions Bar ───────────────────────────────────────

function OwnerActions({listingId, status}: {listingId: string; status: ListingStatus}) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateListingStatus();
    const isPending = isDeleting || isUpdating;

    const handleStatusChange = (newStatus: ListingStatus) => {
        updateStatus({id: listingId, payload: {status: newStatus}});
    }

    const handleDelete = () => {
        deleteListing(listingId, {
        onSuccess: () => router.push("/sell"),
        });
    }

    return (
        <div 
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
        >
            <p className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-200">
                You own this listing
            </p>
            <div className="flex flex-wrap gap-2">
                <Link href={`/listings/${listingId}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                </Link>
                {status === "DRAFT" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => handleStatusChange("ACTIVE")}
                        disabled={isPending}
                    >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Publish
                    </Button>
                )}
                {status === "ACTIVE" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleStatusChange("SOLD")}
                        disabled={isPending}
                    >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark as Sold
                    </Button>
                )}
                {status !== "ARCHIVED" && status !== "SOLD" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-lg"
                        onClick={() => handleStatusChange("ARCHIVED")}
                        disabled={isPending}
                    >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isPending}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </Button>
            </div>
            <ConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                variant="danger"
                title="Delete this listing?"
                description="This will permanently remove your listing and all its images. This cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Keep it"
                loading={isDeleting}
            />
        </div>
    )
}


// Status badge

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  DRAFT: { label: "Draft", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  SOLD: { label: "Sold", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  ARCHIVED: { label: "Archived", className: "bg-muted text-muted-foreground border-border" },
};


export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string;

    const { data, isLoading, error } = useListing(id);
    const { user } = useAuth();

   const listing = data?.listing;
    const isOwner = !!(user && listing && user.id === listing.sellerId)

    const categoryLabel = listing
    ? CATEGORIES.find((c) => c.value === listing.category)?.label || listing.category
    : "";
  const conditionObj = listing
    ? CONDITIONS.find((c) => c.value === listing.condition)
    : null;

  const statusStyle = listing
    ? STATUS_STYLES[listing.status] || STATUS_STYLES.ACTIVE
    : null;

  const createdDate = listing
    ? new Date(listing.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Loading
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  // Error / not found
  if (error || !listing) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mb-1 text-lg font-semibold">Listing not found</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            This listing may have been removed or doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl">
            Back to home
          </Button>
        </div>
      </>
    );
  }

    return (
        <>
            <Header />

            <div className="mx-auto max-w-6xl">
                {/* Back link */}
                <div className="px-4 py-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </button>
                </div>
                <div className="grid gap-8 px-4 pb-10 md:grid-cols-2">
                    {/* Left: Images */}
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <ImageGallery images={listing.images} title={listing.title} />
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        {/* Owner actions */}
                        {isOwner && <OwnerActions listingId={listing.id} status={listing.status} />}

                        {/* Status + Price */}
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                {statusStyle && isOwner && (
                                    <span
                                        className={cn(
                                        "rounded-md border px-2 py-0.5 text-xs font-semibold",
                                        statusStyle.className
                                        )}
                                    >
                                        {statusStyle.label}
                                    </span>
                                )}
                                {listing.status === "SOLD" && !isOwner && (
                                    <span className="rounded-md border border-blue-200 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600">
                                        Sold
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold leading-tight md:text-3xl">
                                {listing.title}
                            </h1>

                            <p className="mt-3 text-3xl font-extrabold text-primary">
                                £{parseFloat(listing.price).toFixed(2)}
                            </p>
                        </div>

                        {/* Quick details */}
                        <div className="flex flex-wrap gap-2">
                            {listing.brand && (
                                <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                                {listing.brand}
                                </span>
                            )}
                            <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                                {categoryLabel}
                            </span>
                            <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                                Size {listing.size}
                            </span>
                            <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                                {conditionObj?.label || listing.condition.replace(/_/g, " ")}
                            </span>
                            {listing.color && (
                                <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                                {listing.color}
                                </span>
                            )}
                        </div>


                        {/* Buyer Actions */}
                        {!isOwner && listing.status === "ACTIVE" && (
                            <div className="flex gap-3">
                                <Button className="flex-1 gap-2 rounded-xl py-6 text-base font-semibold">
                                    Buy now
                                    </Button>
                                <Button variant="outline" className="gap-2 rounded-xl py-6">
                                    <MessageCircle className="h-5 w-5" />
                                    Message
                                </Button>
                                <Button variant="outline" size="icon" className="h-auto rounded-xl py-6">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        {/* Description */}
                        {listing.description && (
                            <div>
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Description
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {listing.description}
                                </p>
                            </div>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                {listing.viewCount} view{listing.viewCount !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                Listed {createdDate}
                            </span>
                        </div>

                        {/* Seller Info */}
                        <div className="rounded-xl border border-border p-4">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Seller
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                                    {(listing.seller?.displayName || listing.seller?.username || "U")[0].toUpperCase()}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">
                                    {listing.seller?.displayName || listing.seller?.username || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Member since{" "}
                                    {new Date(listing.seller?.createdAt || "").toLocaleDateString("en-GB", {
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                            {!isOwner && (
                                <Link
                                    href={`/profile/${listing.sellerId}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    View shop
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Buyer Protection */}
                    {!isOwner && (
                        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div>
                            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                Buyer Protection
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                Get the item as described or your money back. All purchases are covered.
                            </p>
                            </div>
                        </div>
                    )}

                    {/* Share */}
                    <button onClick={() => {
                        if(navigator.share) {
                            navigator.share({
                                title: listing.title,
                                url: window.location.href
                            });
                        } else {
                            navigator.clipboard.writeText(window.location.href)
                        }

                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Share2 className="h-4 w-4" />
                        Share this listing
                    </button>
                </div>
            </div>
        </>
    );
}