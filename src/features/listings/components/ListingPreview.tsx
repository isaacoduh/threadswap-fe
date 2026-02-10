"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { CreateListingFormData, CATEGORIES, CONDITIONS } from "../schemas/listing.schema";

interface ImageFile {
  file: File;
  preview: string;
}

interface ListingPreviewProps {
  data: CreateListingFormData;
  images: ImageFile[];
}

export function ListingPreview({ data, images }: ListingPreviewProps) {
  const categoryLabel =
    CATEGORIES.find((c) => c.value === data.category)?.label || data.category;
  const conditionLabel =
    CONDITIONS.find((c) => c.value === data.condition)?.label || data.condition;

  const checks = [
    `${images.length} photo${images.length !== 1 ? "s" : ""} added`,
    "All details completed",
    "Ready to publish",
  ];

  return (
    <div className="space-y-6">
      {/* Preview card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Cover image */}
        {images[0] && (
          <div className="relative aspect-square bg-muted">
            <Image
              src={images[0].preview}
              alt={data.title}
              fill
              className="object-cover"
            />
            <div className="absolute left-3 top-3 rounded-lg bg-card/90 px-3 py-1.5 text-lg font-bold backdrop-blur-sm">
              £{data.price.toFixed(2)}
            </div>
          </div>
        )}

        {/* Image strip */}
        {images.length > 1 && (
          <div className="flex gap-1 p-1 pt-0">
            {images.slice(1, 5).map((img, i) => (
              <div
                key={img.preview}
                className="relative aspect-square flex-1 overflow-hidden rounded-md bg-muted"
              >
                <Image
                  src={img.preview}
                  alt={`${data.title} ${i + 2}`}
                  fill
                  className="object-cover"
                />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-sm font-semibold text-background">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="p-4">
          <p className="mb-0.5 text-sm text-muted-foreground">{data.brand}</p>
          <h3 className="mb-3 text-lg font-semibold leading-tight">{data.title}</h3>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-secondary px-3 py-1 text-sm">
              {categoryLabel}
            </span>
            <span className="rounded-lg bg-secondary px-3 py-1 text-sm">
              Size {data.size}
            </span>
            <span className="rounded-lg bg-secondary px-3 py-1 text-sm">
              {conditionLabel}
            </span>
            {data.color && (
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm">
                {data.color}
              </span>
            )}
          </div>

          {data.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {checks.map((label) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-4 w-4" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}