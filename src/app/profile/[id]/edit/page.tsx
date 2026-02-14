"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUserProfile } from "@/features/profile/hooks/useProfile";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";

export default function EditProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, isLoading } = useUserProfile(id);

  const isOwner = !!user && user.id === id;
  const profile = data?.profile;

  // Redirect non-owners away
  useEffect(() => {
    if (!authLoading && !isOwner) {
      router.replace(`/profile/${id}`);
    }
  }, [authLoading, isOwner, id, router]);

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile || !isOwner) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>
      <EditProfileForm profile={profile} />
    </div>
  );
}