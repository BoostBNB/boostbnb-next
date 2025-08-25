import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://a0.muscache.com/**')],
  },
};

export default nextConfig;
