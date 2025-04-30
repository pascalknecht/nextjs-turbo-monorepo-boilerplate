import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const client = createAuthClient({
  plugins: [organizationClient()],
});

export const { signUp, signIn, signOut, useSession } = client;
