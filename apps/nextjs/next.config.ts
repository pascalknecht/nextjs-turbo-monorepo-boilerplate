import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },

  serverExternalPackages: ["@prisma/adapter-pg"],

  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
