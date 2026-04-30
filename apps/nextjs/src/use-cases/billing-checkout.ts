import { stripe } from "@/lib/stripe";

type CheckoutFinalizeResult =
  | { status: "noop" }
  | { status: "cancelled-previous" }
  | { status: "pending" }
  | { status: "error"; message: string };

function getSubscriptionIdFromCheckoutSessionSubscription(
  subscription:
    | string
    | {
        id: string;
      }
    | null
): string | null {
  if (!subscription) {
    return null;
  }

  if (typeof subscription === "string") {
    return subscription;
  }

  return subscription.id;
}

export async function finalizeCheckoutSubscriptionUpdate(params: {
  sessionId: string;
  userId: string;
}): Promise<CheckoutFinalizeResult> {
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      params.sessionId,
      {
        expand: ["subscription"],
      }
    );

    if (checkoutSession.metadata?.user_id !== params.userId) {
      return { status: "error", message: "Checkout session does not match user." };
    }

    if (checkoutSession.mode !== "subscription") {
      return { status: "noop" };
    }

    if (checkoutSession.status !== "complete") {
      return { status: "pending" };
    }

    if (checkoutSession.metadata?.intent !== "update") {
      return { status: "noop" };
    }

    const previousSubscriptionId =
      checkoutSession.metadata.previous_subscription_id;
    const newSubscriptionId =
      getSubscriptionIdFromCheckoutSessionSubscription(
        checkoutSession.subscription as string | { id: string } | null
      ) ?? null;

    if (!previousSubscriptionId || !newSubscriptionId) {
      return { status: "noop" };
    }

    if (previousSubscriptionId === newSubscriptionId) {
      return { status: "noop" };
    }

    try {
      const previousSubscription = await stripe.subscriptions.retrieve(
        previousSubscriptionId
      );

      if (
        previousSubscription.status === "canceled" ||
        previousSubscription.status === "incomplete_expired"
      ) {
        return { status: "noop" };
      }
    } catch {
      return { status: "noop" };
    }

    await stripe.subscriptions.cancel(previousSubscriptionId, {
      prorate: false,
      invoice_now: false,
    });

    return { status: "cancelled-previous" };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to finalize checkout update.",
    };
  }
}
