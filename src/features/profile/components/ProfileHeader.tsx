"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../types";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwner: boolean;
}

export function ProfileHeader({ profile, isOwner }: ProfileHeaderProps) {
  const initial = (profile.displayName || profile.username || "U")[0].toUpperCase();
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      {/* Avatar */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full sm:h-28 sm:w-28">
        {profile.avatar?.url ? (
          <Image
            src={profile.avatar.url}
            alt={profile.displayName || "Avatar"}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold">
            {profile.displayName || profile.username || "User"}
          </h1>
          {isOwner && (
            <Link href={`/profile/${profile.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        {profile.username && (
          <p className="mt-0.5 text-sm text-muted-foreground">@{profile.username}</p>
        )}

        {profile.bio && (
          <p className="mt-2 max-w-lg whitespace-pre-wrap text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}

        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
          <Calendar className="h-3.5 w-3.5" />
          Member since {memberSince}
        </p>
      </div>
    </div>
  );
}