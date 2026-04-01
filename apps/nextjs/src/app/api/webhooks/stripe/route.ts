import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // TODO: Handle checkout.session.completed event
      break;
    }
    case "invoice.payment_succeeded": {
      // TODO: Handle invoice.payment_succeeded event
      break;
    }
  }

  return new Response(null, { status: 200 });
}
