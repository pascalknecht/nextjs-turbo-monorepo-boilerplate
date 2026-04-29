import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { env } from "@/env";

export const client = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [organizationClient()],
});

export const { signUp, signIn, signOut, useSession } = client;
