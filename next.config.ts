import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // External image hosts used by next/image.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }, // sample/seed photos
      { protocol: "https", hostname: "*.vercel-storage.com" }, // admin uploads via Vercel Blob
    ],
  },
};

export default nextConfig;
