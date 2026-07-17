import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Wikimedia hostnames
    remotePatterns: [
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
