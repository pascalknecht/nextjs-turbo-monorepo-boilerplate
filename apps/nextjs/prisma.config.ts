import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(appRoot, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
