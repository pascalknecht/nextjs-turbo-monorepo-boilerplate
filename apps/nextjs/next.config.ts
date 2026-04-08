import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: process.env.DOCKER === "1" ? "standalone" : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  serverExternalPackages: ["@prisma/adapter-pg"],

  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
