import { Instagram, Globe } from "lucide-react";
import type { ProfileSocials as ProfileSocialsType } from "../types";

interface ProfileSocialsProps {
  socials: ProfileSocialsType;
}

export function ProfileSocials({ socials }: ProfileSocialsProps) {
  const hasAny = socials.instagram || socials.website;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-3">
      
      <p>Socials Page</p>
    </div>
  );
}