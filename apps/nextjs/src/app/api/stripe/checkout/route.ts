import { env } from "@/env";
import { getSSRSession } from "@/lib/get-server-session";
import { stripe } from "@/lib/stripe";
import { getBillingStateForUser } from "@/use-cases/billing";
import { z } from "zod";

const checkoutBodySchema = z.object({
  priceId: z.string().min(1),
  intent: z.enum(["create", "update"]).default("create"),
});

export async function POST(request: Request) {
  if (!env.STRIPE_API_KEY) {
    return Response.json(
      { error: "Stripe is not configured for this environment." },
      { status: 500 }
    );
  }

  const { user } = await getSSRSession();

  if (!user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid checkout payload.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const billingState = await getBillingStateForUser(user.email);
  const plan = billingState.plans.find(
    (billingPlan) => billingPlan.priceId === parsed.data.priceId
  );

  if (!plan) {
    return Response.json(
      { error: "The selected plan is not available." },
      { status: 404 }
    );
  }

  if (parsed.data.intent === "update" && !billingState.activeSubscription) {
    return Response.json(
      { error: "No active subscription was found to update." },
      { status: 400 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: parsed.data.priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    customer: billingState.customerId ?? undefined,
    customer_email: billingState.customerId ? undefined : user.email,
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings?billing=checkout-success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings?billing=checkout-cancelled`,
    metadata: {
      user_id: user.id,
      intent: parsed.data.intent,
      previous_subscription_id: billingState.activeSubscription?.id ?? "",
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        intent: parsed.data.intent,
      },
    },
  });

  if (!checkoutSession.url) {
    return Response.json(
      { error: "Stripe checkout session did not include a redirect URL." },
      { status: 500 }
    );
  }

  return Response.json({ url: checkoutSession.url });
}
