import { z } from "zod";

export const editProfileSchema = z.object({
  displayName: z
    .string()
    .max(50, "Display name must be 50 characters or less")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or less")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .max(30)
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;