import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    typedRoutes: true,
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
