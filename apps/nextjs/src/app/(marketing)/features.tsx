import {
  BarChart3,
  Globe,
  Layers,
  Lock,
  RefreshCw,
  Zap,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on edge infrastructure for sub-100ms response times. Your team never waits.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified with end-to-end encryption, SSO, and role-based access controls.",
  },
  {
    icon: Layers,
    title: "Powerful Integrations",
    description:
      "Connect with 200+ tools your team already uses. Slack, GitHub, Jira, and more.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track every metric that matters with customizable dashboards and automated reports.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Deploy across 30+ regions worldwide. Automatic failover and 99.99% uptime SLA.",
  },
  {
    icon: RefreshCw,
    title: "Automated Workflows",
    description:
      "Build custom automations with our visual workflow editor. No code required.",
  },
];

const steps = [
  {
    step: "01",
    title: "Connect your tools",
    description:
      "Integrate your existing stack in minutes with our one-click connectors and open API.",
  },
  {
    step: "02",
    title: "Configure your workspace",
    description:
      "Set up teams, permissions, and workflows tailored to how your organization operates.",
  },
  {
    step: "03",
    title: "Scale with confidence",
    description:
      "Launch to your team and watch productivity soar. We handle the infrastructure.",
  },
];

export function FeaturesSection() {
  return (
    <>
      <section className="border-t border-border py-20 md:py-28" id="features">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Features
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to ship faster
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              A complete toolkit designed for modern teams. Focus on building
              your product, not managing your tools.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/10 hover:shadow-md"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-border bg-muted/30 py-20 md:py-28"
        id="how-it-works"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              How it works
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Up and running in minutes
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Getting started takes less time than your morning coffee.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">{step.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
