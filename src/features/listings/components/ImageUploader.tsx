"use client";

import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, GripVertical, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  error?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 8,
  error,
}: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = maxImages - images.length;
      const newFiles = acceptedFiles.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      onChange([...images, ...newFiles]);
    },
    [images, maxImages, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    disabled: images.length >= maxImages,
  });

  const removeImage = useCallback(
    (index: number) => {
      const updated = [...images];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      onChange(updated);
    },
    [images, onChange]
  );

  const isFull = images.length >= maxImages;

  const dropzoneLabel = useMemo(() => {
    if (isFull) return "Maximum photos reached";
    if (isDragActive) return "Drop your photos here";
    return "Drag photos here or tap to browse";
  }, [isFull, isDragActive]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 transition-all",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/25 bg-secondary/50 hover:border-primary/50 hover:bg-secondary",
          isFull && "pointer-events-none opacity-50",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isDragActive ? "bg-primary/20" : "bg-primary/10"
          )}
        >
          <Camera
            className={cn(
              "h-7 w-7 transition-colors",
              isDragActive ? "text-primary" : "text-primary/70"
            )}
          />
        </div>
        <div className="text-center">
          <p className="font-medium">{dropzoneLabel}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            JPG, PNG or WebP · Max 5MB each · {images.length}/{maxImages}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div
              key={img.preview}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={img.preview}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Drag handle hint */}
              <div className="absolute left-1.5 top-1.5 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-70">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background">
                  COVER
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}