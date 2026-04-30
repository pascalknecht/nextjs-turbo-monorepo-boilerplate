import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl border-y border-border py-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Start building now
              </p>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                Ship the serious version first, skip the rewrite phase.
              </h2>
              <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
                This starter gives your team production defaults from day one,
                so effort goes into product decisions instead of infrastructure
                cleanup.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="space-y-3 border border-border/80 bg-muted/30 p-5">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link href="#pricing">View Pricing</Link>
                </Button>
                <p className="pt-2 text-xs text-muted-foreground">
                  No credit card required for the starter plan.
                </p>
              </div>
            </div>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <li>Auth, billing, and database flow already integrated</li>
            <li>Type-safe defaults with clear extension points</li>
            <li>Built for teams that care about shipping quality</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
