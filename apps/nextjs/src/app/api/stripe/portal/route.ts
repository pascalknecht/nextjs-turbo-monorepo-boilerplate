import { env } from "@/env";
import { getSSRSession } from "@/lib/get-server-session";
import { stripe } from "@/lib/stripe";
import { getBillingStateForUser } from "@/use-cases/billing";

export async function POST() {
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

  const billingState = await getBillingStateForUser(user.email);
  if (!billingState.customerId) {
    return Response.json(
      { error: "No Stripe customer found for this account yet." },
      { status: 404 }
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: billingState.customerId,
    return_url: `${env.NEXT_PUBLIC_APP_URL}/settings?billing=portal-return`,
  });

  return Response.json({ url: portalSession.url });
}
