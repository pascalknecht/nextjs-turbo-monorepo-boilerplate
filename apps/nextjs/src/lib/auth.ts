import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { organization } from "better-auth/plugins";
import { env } from "@/env";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [organization()],
});
