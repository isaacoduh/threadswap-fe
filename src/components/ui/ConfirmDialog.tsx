"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Focus trap — auto-focus cancel button
  useEffect(() => {
    if (open && dialogRef.current) {
      const cancel = dialogRef.current.querySelector<HTMLButtonElement>(
        "[data-cancel]"
      );
      cancel?.focus();
    }
  }, [open]);

  if (!open) return null;

  const iconColor = {
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-amber-500/10 text-amber-600",
    default: "bg-primary/10 text-primary",
  }[variant];

  const confirmColor = {
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    default: "",
  }[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby={description ? "confirm-desc" : undefined}
          className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 text-center">
            {/* Icon */}
            <div
              className={cn(
                "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                iconColor
              )}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>

            {/* Title */}
            <h3
              id="confirm-title"
              className="mb-2 text-lg font-semibold"
            >
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p
                id="confirm-desc"
                className="mb-6 text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                data-cancel
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl"
              >
                {cancelLabel}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className={cn("flex-1 rounded-xl", confirmColor)}
              >
                {loading ? "..." : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}