"use client";

import { LoaderButton } from "@/components/loader-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export type BillingPlanView = {
  priceId: string;
  productName: string;
  productDescription: string | null;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
};

export type BillingStateView = {
  customerId: string | null;
  customerEmail: string | null;
  hasActiveSubscription: boolean;
  activeSubscription: {
    id: string;
    status: string | null;
    priceId: string | null;
    productName: string | null;
    currentPeriodEnd: number | null;
  } | null;
  plans: BillingPlanView[];
};

type CheckoutIntent = "create" | "update";

function formatPrice(plan: BillingPlanView): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const amount = plan.amount / 100;
  return formatter.format(amount);
}

function formatInterval(plan: BillingPlanView): string {
  if (plan.intervalCount <= 1) {
    return `/${plan.interval}`;
  }
  return `every ${plan.intervalCount} ${plan.interval}s`;
}

function formatSubscriptionStatus(status: string | null): string {
  if (!status) {
    return "Unknown";
  }
  return status.replaceAll("_", " ");
}

function formatDateFromUnix(timestamp: number | null): string {
  if (!timestamp) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(timestamp * 1000));
}

type SubscriptionManagementProps = {
  billingState: BillingStateView;
};

export function SubscriptionManagement({
  billingState,
}: SubscriptionManagementProps) {
  const [submittingPlanId, setSubmittingPlanId] = useState<string | null>(null);
  const [isPortalPending, startPortalTransition] = useTransition();

  const currentPlanId = billingState.activeSubscription?.priceId ?? null;

  async function startCheckout(priceId: string, intent: CheckoutIntent) {
    try {
      setSubmittingPlanId(priceId);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          intent,
        }),
      });

      const data = (await response.json()) as { error?: string; url?: string };

      if (!response.ok) {
        toast.error(data.error ?? "Unable to create checkout session.");
        return;
      }

      if (!data.url) {
        toast.error("Stripe checkout did not return a redirect URL.");
        return;
      }

      window.location.assign(data.url);
    } catch {
      toast.error("Something went wrong while starting checkout.");
    } finally {
      setSubmittingPlanId(null);
    }
  }

  function openPortal() {
    startPortalTransition(async () => {
      try {
        const response = await fetch("/api/stripe/portal", {
          method: "POST",
        });

        const data = (await response.json()) as { error?: string; url?: string };

        if (!response.ok) {
          toast.error(data.error ?? "Unable to open Stripe customer portal.");
          return;
        }

        if (!data.url) {
          toast.error("Stripe customer portal did not return a redirect URL.");
          return;
        }

        window.location.assign(data.url);
      } catch {
        toast.error("Something went wrong while opening customer portal.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-3" />
              Billing
            </Badge>
            {billingState.hasActiveSubscription ? (
              <Badge className="capitalize">
                {formatSubscriptionStatus(billingState.activeSubscription?.status ?? null)}
              </Badge>
            ) : (
              <Badge variant="outline">No active subscription</Badge>
            )}
          </div>
          <CardTitle className="text-xl">Subscription management</CardTitle>
          <CardDescription>
            Start a subscription with Stripe Checkout, switch plans with Checkout,
            or manage billing details in the Stripe Customer Portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border bg-muted/40 p-3">
              <p className="text-muted-foreground">Current plan</p>
              <p className="font-medium">
                {billingState.activeSubscription?.productName ?? "No plan selected"}
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/40 p-3">
              <p className="text-muted-foreground">Renews / ends</p>
              <p className="font-medium">
                {formatDateFromUnix(billingState.activeSubscription?.currentPeriodEnd ?? null)}
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/40 p-3">
              <p className="text-muted-foreground">Stripe customer</p>
              <p className="truncate font-medium">
                {billingState.customerId ?? "Created on first checkout"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <LoaderButton
            variant="outline"
            onClick={openPortal}
            isLoading={isPortalPending}
            disabled={!billingState.customerId}
            className="w-full sm:w-auto"
          >
            <CreditCard />
            Open customer portal
            <ArrowUpRight />
          </LoaderButton>
          <p className="text-xs text-muted-foreground">
            {billingState.customerId
              ? "Use portal to update payment methods, invoices, or cancel."
              : "Customer portal becomes available after first successful checkout."}
          </p>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {billingState.plans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.priceId;
          const intent: CheckoutIntent = billingState.hasActiveSubscription
            ? "update"
            : "create";
          const buttonLabel = billingState.hasActiveSubscription
            ? isCurrentPlan
              ? "Current plan"
              : "Switch with Checkout"
            : "Start subscription";

          return (
            <Card
              key={plan.priceId}
              className={cn(
                "border-border/60 transition-colors",
                isCurrentPlan && "border-primary/40 bg-primary/5"
              )}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{plan.productName}</CardTitle>
                  {isCurrentPlan ? (
                    <Badge className="gap-1">
                      <CheckCircle2 className="size-3" />
                      Current
                    </Badge>
                  ) : (
                    <Badge variant="outline">{plan.interval}</Badge>
                  )}
                </div>
                <CardDescription>
                  {plan.productDescription ?? "Flexible plan for your workspace."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-3xl font-semibold">{formatPrice(plan)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatInterval(plan)}
                  </p>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  {billingState.hasActiveSubscription
                    ? "Checkout opens with the selected plan for your existing Stripe customer."
                    : "Checkout creates your first subscription and Stripe customer record."}
                </div>
              </CardContent>
              <CardFooter>
                <LoaderButton
                  className="w-full"
                  onClick={() => startCheckout(plan.priceId, intent)}
                  isLoading={submittingPlanId === plan.priceId}
                  disabled={isCurrentPlan}
                >
                  {submittingPlanId === plan.priceId ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCcw />
                  )}
                  {buttonLabel}
                </LoaderButton>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
