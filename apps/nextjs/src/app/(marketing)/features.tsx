import {
  ArrowRight,
  Blocks,
  ChartNoAxesCombined,
  Database,
  Lock,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import React from "react";

const capabilities = [
  {
    icon: Blocks,
    title: "Composable architecture",
    summary: "Build on a starter that respects clean boundaries and real-world growth.",
    bullets: [
      "Business logic isolated in use-cases",
      "Auth and billing wired from day one",
      "Monorepo-ready structure with Turborepo",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Production confidence",
    summary: "Launch with security and reliability patterns already in place.",
    bullets: [
      "Role-aware auth with Better Auth",
      "Type-safe env validation with Zod",
      "Prisma + PostgreSQL integration out of the box",
    ],
  },
  {
    icon: ChartNoAxesCombined,
    title: "Scale-ready operations",
    summary: "Operate and iterate without rebuilding the foundation later.",
    bullets: [
      "Stripe checkout and webhook flow included",
      "Testing + linting + typecheck scripts preconfigured",
      "Smooth path from localhost to Vercel deployment",
    ],
  },
];

const steps = [
  {
    step: "1",
    title: "Clone and configure",
    description:
      "Install dependencies, set your environment variables, and run your local stack in minutes.",
    icon: Database,
  },
  {
    step: "2",
    title: "Ship the core flow",
    description:
      "Enable auth, billing, and data models, then deliver your first customer-facing path fast.",
    icon: Workflow,
  },
  {
    step: "3",
    title: "Harden and scale",
    description:
      "Expand with confidence using typed boundaries, tested modules, and deployment-ready defaults.",
    icon: Lock,
  },
];

export function FeaturesSection() {
  return (
    <>
      <section className="border-t border-border py-20 md:py-28" id="features">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-6xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Core capabilities
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
              The foundation feels mature from day one
            </h2>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Instead of feature bloat, you get opinionated primitives you can
              trust under real product pressure.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-0 border-y border-border">
            {capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="grid gap-6 border-b border-border py-8 last:border-b-0 md:grid-cols-12 md:py-10"
              >
                <div className="md:col-span-4">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                    <capability.icon className="size-5 text-primary" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Pillar 0{index + 1}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {capability.summary}
                  </p>
                </div>
                <ul className="space-y-3 md:col-span-8 md:pt-8">
                  {capability.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 border-b border-border/70 pb-3 text-sm last:border-b-0 last:pb-0"
                    >
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-border bg-muted/30 py-20 md:py-28"
        id="how-it-works"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-6xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Implementation path
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
              From blank repo to production momentum
            </h2>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              A clear sequence that keeps teams shipping instead of reworking
              foundations.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.step}
                className="rounded-2xl border border-border/80 bg-background p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Step {step.step}
                  </span>
                  <step.icon className="size-4 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
