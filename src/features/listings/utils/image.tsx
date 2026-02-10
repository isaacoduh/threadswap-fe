import type { ListingImage } from "@/features/listings/types";

const S3_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BASE_URL ||
  "https://threadswap-dev-isaac-9080d.s3.eu-west-2.amazonaws.com";


/**
 * Resolves the display URL for a listing image.
 * Priority: signed url → constructed URL from key → null
 */
export function getListingImageUrl(image: ListingImage | undefined | null): string | null {
  if (!image) return null;
  if (image.url) return image.url;
  if (image.key) return `${S3_BASE_URL}/${image.key}`;
  return null;
}

/**
 * Resolves all image URLs for a listing's images array.
 */
export function getListingImageUrls(images: ListingImage[] | undefined | null): string[] {
  if (!images) return [];
  return images
    .map((img) => getListingImageUrl(img))
    .filter((url): url is string => url !== null);
}