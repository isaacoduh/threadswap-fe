import { Instagram, Globe } from "lucide-react";
import type { ProfileSocials as ProfileSocialsType } from "../types";

interface ProfileSocialsProps {
  socials: ProfileSocialsType;
}

export function ProfileSocials({ socials }: ProfileSocialsProps) {
  const hasAny = socials.instagram || socials.website;
  if (!hasAny) return null;

  return (
    <>
        <div className="flex flex-wrap gap-3">
            {socials.instagram && (
                <a 
                    href={`https://instagram.com/${socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Instagram className="h-4 w-4" />
                    @{socials.instagram}
                </a>
            )}
            {socials.website && (
                <a
                    href={socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Globe className="h-4 w-4" />
                    {socials.website.replace(/^https?:\/\//, "")}
                </a>
            )}
        </div>
    </>
  );
}