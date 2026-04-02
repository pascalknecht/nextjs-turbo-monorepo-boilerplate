import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "For small teams getting started",
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
    description: "For growing teams that need more",
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
    description: "For large organizations",
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
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            No hidden fees. No surprises. Pick a plan that scales with your
            team.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg"
                  : "border-border bg-card hover:border-foreground/10 hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.ctaVariant}
                size="lg"
                className="w-full"
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
