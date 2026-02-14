"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "../hooks/useProfile";
import { AvatarUpload } from "./AvatarUpload";
import { editProfileSchema, type EditProfileFormValues } from "../schemas/profile.schema";
import type { UserProfile } from "../types";

interface EditProfileFormProps {
  profile: UserProfile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: profile.displayName || "",
      username: profile.username || "",
      bio: profile.bio || "",
      instagram: profile.socials?.instagram || "",
      website: profile.socials?.website || "",
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    setServerError(null);

    const payload = {
      displayName: values.displayName || undefined,
      username: values.username || undefined,
      bio: values.bio || undefined,
      socials: {
        instagram: values.instagram || undefined,
        website: values.website || undefined,
      },
    };

    updateProfile(
      { id: profile.id, payload },
      {
        onSuccess: () => router.push(`/profile/${profile.id}`),
        onError: (err: any) => {
          setServerError(err?.message || "Failed to update profile");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar */}
      <AvatarUpload
        userId={profile.id}
        avatar={profile.avatar}
        displayName={profile.displayName}
      />

      {/* Fields */}
      <div className="space-y-4">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Display Name</label>
          <input
            {...register("displayName")}
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          {errors.displayName && (
            <p className="text-xs text-red-500">{errors.displayName.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Username</label>
          <div className="flex items-center rounded-lg border border-border bg-background transition-colors focus-within:border-primary">
            <span className="pl-3 text-sm text-muted-foreground">@</span>
            <input
              {...register("username")}
              placeholder="username"
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            {...register("bio")}
            placeholder="Tell people about yourself…"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          {errors.bio && (
            <p className="text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Socials divider */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Socials
          </h3>
        </div>

        {/* Instagram */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Instagram</label>
          <div className="flex items-center rounded-lg border border-border bg-background transition-colors focus-within:border-primary">
            <span className="pl-3 text-sm text-muted-foreground">@</span>
            <input
              {...register("instagram")}
              placeholder="handle"
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
          </div>
          {errors.instagram && (
            <p className="text-xs text-red-500">{errors.instagram.message}</p>
          )}
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Website</label>
          <input
            {...register("website")}
            placeholder="https://yoursite.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          {errors.website && (
            <p className="text-xs text-red-500">{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {serverError}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="flex-1 rounded-xl py-5 font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl py-5"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}