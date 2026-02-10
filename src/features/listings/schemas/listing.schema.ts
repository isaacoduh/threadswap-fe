import { z } from "zod";

export const CATEGORIES = [
  { value: "TOPS", label: "Tops" },
  { value: "BOTTOMS", label: "Bottoms" },
  { value: "DRESSES", label: "Dresses" },
  { value: "OUTERWEAR", label: "Outerwear" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "BAGS", label: "Bags" },
  { value: "JEWELRY", label: "Jewelry" },
  { value: "OTHER", label: "Other" },
] as const;

export const CONDITIONS = [
  {
    value: "NEW_WITH_TAGS",
    label: "New with tags",
    description: "Brand new, never worn, original tags attached",
  },
  {
    value: "NEW_WITHOUT_TAGS",
    label: "New without tags",
    description: "Never worn but tags removed",
  },
  {
    value: "EXCELLENT",
    label: "Excellent",
    description: "Worn once or twice, no visible flaws",
  },
  {
    value: "GOOD",
    label: "Good",
    description: "Light signs of wear, fully functional",
  },
  {
    value: "FAIR",
    label: "Fair",
    description: "Visible wear but still wearable",
  },
] as const;

export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const imageSchema = z
  .custom<File>()
  .refine((file) => file instanceof File, "Expected a file")
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .png, and .webp formats are supported"
  );

export const createListingSchema = z.object({
  images: z
    .array(imageSchema)
    .min(1, "At least 1 photo is required")
    .max(8, "Maximum 8 photos allowed"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  category: z.enum(
    CATEGORIES.map((c) => c.value) as [string, ...string[]],
    { message: "Select a category" }
  ),
  brand: z.string().min(1, "Brand is required").max(50, "Brand must be under 50 characters"),
  size: z.enum(SIZES as unknown as [string, ...string[]], {
    message: "Select a size",
  }),
  condition: z.enum(
    CONDITIONS.map((c) => c.value) as [string, ...string[]],
    { message: "Select the condition" }
  ),
  price: z
    .number({ message: "Enter a valid price" })
    .positive("Price must be greater than 0")
    .max(100000, "Price cannot exceed £100,000"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  color: z.string().max(30).optional(),
});

export type CreateListingFormData = z.infer<typeof createListingSchema>;