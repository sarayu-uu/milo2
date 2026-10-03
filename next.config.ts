import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shake icon + animation barrels so only what we use ships.
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
