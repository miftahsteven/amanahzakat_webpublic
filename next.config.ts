import type { NextConfig } from "next";

const backendOrigin = (
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  "http://localhost:5005"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        // Prefer API-prefixed uploads (works when only /api is proxied).
        destination: `${backendOrigin}/api/v1/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
