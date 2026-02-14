"use client";

import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserProfile } from "@/features/profile/hooks/useProfile";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ProfileSocials } from "@/features/profile/components/ProfileSocials";
import { ProfileListings } from "@/features/profile/components/ProfileListings";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data, isLoading, isError } = useUserProfile(id);

  const isOwner = !!user && user.id === id;
  const profile = data?.profile;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <ProfileStats stats={profile.stats} />
      {profile.socials && <ProfileSocials socials={profile.socials} />}
      <ProfileListings userId={profile.id} isOwner={isOwner} />
    </div>
  );
}