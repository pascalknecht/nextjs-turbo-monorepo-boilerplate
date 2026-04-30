import { getStripeSync } from "@/lib/stripe-sync";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") ?? undefined;

  try {
    const stripeSync = await getStripeSync();
    await stripeSync.processWebhook(body, signature);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unhandled webhook event"
    ) {
      // Ignore unsupported events when Stripe is configured to send all events.
      return new Response(null, { status: 200 });
    }

    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return new Response(
        `Webhook Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { status: 400 }
      );
    }

    return new Response(
      `Webhook Processing Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }

  return new Response(null, { status: 200 });
}
