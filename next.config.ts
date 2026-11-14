import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  compiler: {
    reactRemoveProperties: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**", pathname: "**" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
