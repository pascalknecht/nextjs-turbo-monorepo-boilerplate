import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSSRSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
}
