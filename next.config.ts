import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow remote images (recommended over images.domains)
    remotePatterns: [
      // Example: local dev backend (if you serve images from your API)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },

      // Example: S3 / CloudFront / CDN (edit hostname + pathname)
      {
        protocol: "https",
        hostname: "YOUR-CDN-OR-BUCKET-DOMAIN",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "threadswap-dev-isaac-9080d.s3.eu-west-2.amazonaws.com",
      },
    ],
  }
};

export default nextConfig;
