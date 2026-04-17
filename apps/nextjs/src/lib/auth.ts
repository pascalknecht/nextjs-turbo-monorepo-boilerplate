import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { organization } from "better-auth/plugins";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const useDynamicBaseURL = process.env.NODE_ENV === "development";

const baseURL = useDynamicBaseURL
  ? {
      // Docker dev maps the container to random host ports,
      // so derive the origin from the incoming request host.
      allowedHosts: ["localhost:*", "127.0.0.1:*", "0.0.0.0:*"],
      protocol: "http" as const,
      fallback: process.env.BETTER_AUTH_URL,
    }
  : process.env.BETTER_AUTH_URL;

function toOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const trustedOrigins = Array.from(
  new Set(
    [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ]
      .map((value) => (value ? toOrigin(value) : null))
      .filter((value): value is string => Boolean(value))
  )
);

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [organization()],
});
