import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Most visitors arrive once, on a phone, from Instagram: inline the (small, Tailwind)
  // CSS so first paint doesn't wait on a stylesheet request.
  experimental: { inlineCss: true },
  images: { formats: ['image/avif', 'image/webp'] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
