import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSSRSession } from "@/lib/get-server-session";
import { finalizeCheckoutSubscriptionUpdate } from "@/use-cases/billing-checkout";
import { getBillingStateForUser } from "@/use-cases/billing";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { SubscriptionManagement } from "./_components/subscription-management";

type SettingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getBillingBannerMessage(
  status: string | undefined,
  checkoutFinalizeStatus?: "success" | "pending" | "error"
): {
  variant: "default" | "destructive";
  title: string;
  description: string;
  icon: "success" | "cancelled" | "error";
} | null {
  switch (status) {
    case "checkout-success":
      if (checkoutFinalizeStatus === "error") {
        return {
          variant: "destructive",
          title: "Checkout completed with follow-up issue",
          description:
            "Your new checkout completed, but we could not finalize the previous subscription update automatically. Please use the Stripe Customer Portal to cancel old plans if needed.",
          icon: "error",
        };
      }

      if (checkoutFinalizeStatus === "pending") {
        return {
          variant: "default",
          title: "Checkout processing",
          description:
            "Checkout completed and your Stripe data is syncing. Refresh in a moment to see the latest subscription state.",
          icon: "success",
        };
      }

      return {
        variant: "default",
        title: "Checkout completed",
        description:
          "Your checkout completed successfully and subscription state has been refreshed from Stripe.",
        icon: "success",
      };
    case "checkout-cancelled":
      return {
        variant: "default",
        title: "Checkout cancelled",
        description: "No changes were made. You can retry with any plan.",
        icon: "cancelled",
      };
    case "portal-return":
      return {
        variant: "default",
        title: "Returned from Stripe portal",
        description:
          "Your latest billing state is loaded from your synced Stripe records.",
        icon: "success",
      };
    default:
      return null;
  }
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const billingParam =
    typeof params.billing === "string" ? params.billing : undefined;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  const { user } = await getSSRSession();
  if (!user?.email) {
    throw new Error("You must be signed in to view settings.");
  }

  let checkoutFinalizeStatus: "success" | "pending" | "error" | undefined;
  if (billingParam === "checkout-success" && sessionId) {
    const finalizeResult = await finalizeCheckoutSubscriptionUpdate({
      sessionId,
      userId: user.id,
    });

    if (finalizeResult.status === "cancelled-previous") {
      checkoutFinalizeStatus = "success";
    } else if (finalizeResult.status === "pending") {
      checkoutFinalizeStatus = "pending";
    } else if (finalizeResult.status === "error") {
      checkoutFinalizeStatus = "error";
    }
  }

  const banner = getBillingBannerMessage(billingParam, checkoutFinalizeStatus);

  const billingState = await getBillingStateForUser(user.email);

  const Icon =
    banner?.icon === "success"
      ? CircleCheck
      : banner?.icon === "cancelled"
        ? CircleX
        : CircleAlert;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, billing, and active subscription.
        </p>
      </div>

      {banner ? (
        <Alert variant={banner.variant}>
          <Icon className="size-4" />
          <AlertTitle>{banner.title}</AlertTitle>
          <AlertDescription>{banner.description}</AlertDescription>
        </Alert>
      ) : null}

      {billingState.plans.length === 0 ? (
        <Alert variant="destructive">
          <CircleAlert className="size-4" />
          <AlertTitle>No active Stripe plans found</AlertTitle>
          <AlertDescription>
            Add at least one active recurring price in Stripe. This page reads
            plans from your synced Stripe tables.
          </AlertDescription>
        </Alert>
      ) : (
        <SubscriptionManagement billingState={billingState} />
      )}
    </div>
  );
}
