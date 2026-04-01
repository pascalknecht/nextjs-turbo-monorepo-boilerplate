import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  serverExternalPackages: ["@prisma/adapter-mariadb"],

  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
