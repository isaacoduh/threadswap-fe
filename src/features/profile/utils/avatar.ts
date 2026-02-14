const S3_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BASE_URL ||
  "https://threadswap-dev-isaac-9080d.s3.eu-west-2.amazonaws.com";

export function getAvatarUrl(avatar: { key: string; url: string | null } | null): string | null {
  if (!avatar) return null;
  if (avatar.url) return avatar.url;
  if (avatar.key && S3_BASE_URL) return `${S3_BASE_URL}/${avatar.key}`;
  return null;
}