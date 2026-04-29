import "server-only";
import { StripeSync, runMigrations } from "@supabase/stripe-sync-engine";

const STRIPE_SCHEMA = "stripe";

function requireEnv(name: "DATABASE_URL" | "STRIPE_API_KEY" | "STRIPE_WEBHOOK_SECRET"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function createStripeSync(): Promise<StripeSync> {
  const databaseUrl = requireEnv("DATABASE_URL");
  const stripeSecretKey = requireEnv("STRIPE_API_KEY");
  const stripeWebhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");

  await runMigrations({
    databaseUrl,
    schema: STRIPE_SCHEMA,
  });

  return new StripeSync({
    schema: STRIPE_SCHEMA,
    stripeSecretKey,
    stripeWebhookSecret,
    poolConfig: {
      connectionString: databaseUrl,
      keepAlive: true,
    },
  });
}

declare global {
  var stripeSyncGlobal: StripeSync | undefined;
  var stripeSyncInitPromise: Promise<StripeSync> | undefined;
}

export async function getStripeSync(): Promise<StripeSync> {
  if (globalThis.stripeSyncGlobal) {
    return globalThis.stripeSyncGlobal;
  }

  if (!globalThis.stripeSyncInitPromise) {
    globalThis.stripeSyncInitPromise = createStripeSync().then((sync) => {
      globalThis.stripeSyncGlobal = sync;
      return sync;
    });
  }

  return globalThis.stripeSyncInitPromise;
}
