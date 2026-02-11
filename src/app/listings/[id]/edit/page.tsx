"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Trash2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Header } from "@/components/layout/Header";
import { ItemDetailsForm } from "@/features/listings/components/ItemDetailsForm";
import {
  CATEGORIES,
  CONDITIONS,
  SIZES,
} from "@/features/listings/schemas/listing.schema";
import {
  useListing,
  useUpdateListing,
  useDeleteListing,
} from "@/features/listings/hooks/useListings";
import { getListingImageUrl } from "@/features/listings/utils/image";
import type { ListingImage } from "@/features/listings/types";

// Edit schema — same fields as create but without images (they're managed separately)
const editListingSchema = z.object({
  images: z.any().optional(), // Satisfy ItemDetailsForm type, not actually validated
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  category: z.enum(
    CATEGORIES.map((c) => c.value) as [string, ...string[]],
    { message: "Select a category" }
  ),
  brand: z
    .string()
    .min(1, "Brand is required")
    .max(50, "Brand must be under 50 characters"),
  size: z.enum(SIZES as unknown as [string, ...string[]], {
    message: "Select a size",
  }),
  condition: z.enum(
    CONDITIONS.map((c) => c.value) as [string, ...string[]],
    { message: "Select the condition" }
  ),
  price: z
    .number({ message: "Enter a valid price" })
    .positive("Price must be greater than 0")
    .max(100000, "Price cannot exceed £100,000"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  color: z.string().max(30).optional(),
});

type EditListingFormData = z.infer<typeof editListingSchema>;

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch existing listing
  const { data, isLoading, error } = useListing(id);
  const listing = data?.listing;

  // Mutations
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing();
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  // Form
  const form = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      images: [],
      title: "",
      category: undefined,
      brand: "",
      size: undefined,
      condition: undefined,
      price: undefined,
      description: "",
      color: "",
    },
    mode: "onChange",
  });

  // Pre-populate form when listing data loads
  useEffect(() => {
    if (!listing) return;
    form.reset({
      images: [],
      title: listing.title,
      category: listing.category,
      brand: listing.brand || "",
      size: listing.size,
      condition: listing.condition,
      price: parseFloat(listing.price),
      description: listing.description,
      color: listing.color || "",
    });
  }, [listing, form]);

  const handleSave = () => {
    setSubmitError(null);
    const data = form.getValues();

    updateListing(
      {
        id,
        payload: {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category as any,
          size: data.size,
          brand: data.brand,
          condition: data.condition as any,
          color: data.color || undefined,
        },
      },
      {
        onSuccess: () => router.push(`/listings/${id}`),
        onError: (err: any) => {
          setSubmitError(
            err?.response?.data?.message || "Failed to update listing. Please try again."
          );
        },
      }
    );
  };

  const handleDelete = () => {
    deleteListing(id, {
      onSuccess: () => router.push("/sell"),
      onError: (err: any) => {
        setShowDeleteDialog(false);
        setSubmitError(
          err?.response?.data?.message || "Failed to delete listing. Please try again."
        );
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading listing...
          </p>
        </div>
      </>
    );
  }

  // Error / not found
  if (error || !listing) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-sm font-medium">Listing not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This listing may have been deleted or doesn&apos;t exist.
          </p>
          <Link href="/sell" className="mt-4">
            <Button variant="outline" className="rounded-xl">
              Back to My Listings
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="mx-auto max-w-2xl px-4 pb-32">
        {/* Page header */}
        <div className="flex items-center gap-3 py-6">
          <Link
            href={`/listings/${id}`}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Back to listing"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Edit Listing</h1>
            <p className="text-sm text-muted-foreground">
              Update your listing details
            </p>
          </div>
        </div>

        {/* Existing images (read-only) */}
        {listing.images && listing.images.length > 0 && (
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Current Photos
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img: ListingImage, i: number) => {
                const url = getListingImageUrl(img);
                if (!url) return null;
                return (
                  <div
                    key={img.key || i}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${listing.title} photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-foreground/70 px-1.5 py-0.5 text-[10px] font-semibold text-background">
                        Cover
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              To change photos, delete this listing and create a new one.
            </p>
          </div>
        )}

        {/* Error banner */}
        {submitError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={(e) => e.preventDefault()}>
          <ItemDetailsForm form={form as any} />
        </form>

        {/* Danger zone */}
        <div className="mt-10 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <h3 className="mb-1 text-sm font-semibold text-destructive">
            Danger Zone
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Permanently delete this listing and all its images. This action
            cannot be undone.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Delete Listing
          </Button>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Link href={`/listings/${id}`} className="flex-1">
            <Button variant="outline" className="w-full rounded-xl py-5">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={form.handleSubmit(handleSave)}
            disabled={isUpdating || !form.formState.isDirty}
            className="flex-1 gap-2 rounded-xl py-5 font-semibold"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete this listing?"
        description="This will permanently remove your listing and all its images. Buyers will no longer be able to find it."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        loading={isDeleting}
      />
    </>
  );
}