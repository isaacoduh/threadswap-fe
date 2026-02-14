"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useUploadAvatar } from "../hooks/useProfile";
import { cn } from "@/lib/utils";
import type { ProfileAvatar } from "../types";

interface AvatarUploadProps {
  userId: string;
  avatar: ProfileAvatar | null;
  displayName: string | null;
  onUploaded?: (avatar: ProfileAvatar) => void;
}

export function AvatarUpload({ userId, avatar, displayName, onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: upload, isPending } = useUploadAvatar();

  const initial = (displayName || "U")[0].toUpperCase();
  const src = preview || avatar?.url;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    upload(
      { id: userId, file },
      {
        onSuccess: (data) => {
          onUploaded?.(data.avatar);
        },
        onError: () => {
          setPreview(null);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className={cn(
          "group relative h-28 w-28 overflow-hidden rounded-full transition-opacity",
          isPending && "opacity-60"
        )}
      >
        {src ? (
          <Image src={src} alt="Avatar" fill className="object-cover" sizes="112px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white">
            {initial}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </button>

      <p className="text-xs text-muted-foreground">
        {isPending ? "Uploading…" : "Tap to change photo"}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}