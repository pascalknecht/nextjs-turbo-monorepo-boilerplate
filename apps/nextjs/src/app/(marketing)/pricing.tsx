import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "For solo founders validating demand",
    bestFor: "Best for first launches",
    price: "$0",
    period: "/month",
    cta: "Get Started",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      "Up to 5 team members",
      "3 projects",
      "Basic analytics",
      "Community support",
      "1 GB storage",
    ],
  },
  {
    name: "Pro",
    description: "For teams shipping weekly to customers",
    bestFor: "Best for funded SaaS teams",
    price: "$29",
    period: "/month",
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Up to 25 team members",
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "100 GB storage",
      "Custom integrations",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    description: "For regulated orgs with strict controls",
    bestFor: "Best for scale and compliance",
    price: "$99",
    period: "/month",
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Custom analytics",
      "Dedicated support",
      "Unlimited storage",
      "SSO & SAML",
      "SLA guarantee",
      "Custom contracts",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="border-t border-border py-20 md:py-28" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-6xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Pricing
          </p>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Start free, upgrade only when your product momentum demands it.
          </p>
        </div>

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/80 bg-card">
          <div className="hidden grid-cols-12 border-b border-border bg-muted/35 px-6 py-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground md:grid">
            <div className="col-span-3">Plan</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-5">Includes</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`grid gap-6 border-b border-border px-6 py-7 last:border-b-0 md:grid-cols-12 ${plan.highlighted ? "bg-primary/[0.03]" : ""}`}
            >
              <div className="md:col-span-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.badge ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary-foreground">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {plan.bestFor}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-4xl font-semibold tracking-tight">{plan.price}</p>
                <p className="text-sm text-muted-foreground">{plan.period}</p>
              </div>

              <ul className="space-y-2.5 md:col-span-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="md:col-span-2 md:flex md:justify-end">
                <Button variant={plan.ctaVariant} size="lg" asChild>
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
