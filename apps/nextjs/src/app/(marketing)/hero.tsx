"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function FloatingCard({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className={`absolute rounded-2xl border border-border bg-card p-4 shadow-lg transition-all ${className}`}
      style={{
        animation: `float 6s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );
}

function ScreenCard({
  title,
  className,
  delay = 0,
  children,
}: {
  title: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <FloatingCard className={className} delay={delay}>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="size-2 rounded-full bg-red-400" />
          <div className="size-2 rounded-full bg-yellow-400" />
          <div className="size-2 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </FloatingCard>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-32 pt-20 md:pb-40 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
              <Sparkles className="size-3" />
              Now in Public Beta
            </Badge>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
            The modern platform
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-transparent">
              for growing teams
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
            Streamline your workflow, collaborate seamlessly, and ship faster
            with an all-in-one platform built for modern SaaS teams.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required &middot; 14-day free trial &middot; Cancel
            anytime
          </p>
        </div>

        <div className="relative mx-auto mt-20 h-[340px] max-w-5xl md:h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-full max-w-2xl rounded-3xl border border-border bg-card/80 shadow-2xl backdrop-blur-sm md:h-72">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-400" />
                  <div className="size-2.5 rounded-full bg-yellow-400" />
                  <div className="size-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Dashboard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-5">
                <div className="space-y-3">
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-8 rounded-lg bg-primary/10" />
                  <div className="h-8 rounded-lg bg-muted" />
                  <div className="h-8 rounded-lg bg-muted" />
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="flex gap-3">
                    <div className="h-20 flex-1 rounded-lg bg-primary/5 p-3">
                      <div className="mb-2 h-2 w-12 rounded bg-muted" />
                      <div className="text-xl font-bold text-foreground/70">
                        2,847
                      </div>
                    </div>
                    <div className="h-20 flex-1 rounded-lg bg-primary/5 p-3">
                      <div className="mb-2 h-2 w-12 rounded bg-muted" />
                      <div className="text-xl font-bold text-foreground/70">
                        94.2%
                      </div>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-muted/50 p-3 md:h-28">
                    <div className="flex h-full items-end gap-1.5">
                      {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-primary/20"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ScreenCard
            title="Analytics"
            className="left-0 top-4 w-44 md:left-4 md:w-52"
            delay={0}
          >
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">MRR</span>
                <span className="text-xs font-medium text-green-600">
                  +12.5%
                </span>
              </div>
              <div className="text-lg font-bold">$48.2K</div>
              <div className="flex h-8 items-end gap-0.5">
                {[30, 45, 35, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/30"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </ScreenCard>

          <ScreenCard
            title="Team Activity"
            className="bottom-4 right-0 w-48 md:bottom-8 md:right-4 md:w-56"
            delay={2}
          >
            <div className="space-y-2">
              {["Sarah K.", "Mike R.", "Anna L."].map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-primary/20" />
                  <div className="flex-1">
                    <div className="text-[10px] font-medium">{name}</div>
                    <div className="h-1 rounded bg-muted">
                      <div
                        className="h-1 rounded bg-primary/40"
                        style={{ width: `${80 - i * 15}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScreenCard>

          <ScreenCard
            title="Notifications"
            className="bottom-0 left-2 w-44 md:bottom-4 md:left-8 md:w-48"
            delay={4}
          >
            <div className="space-y-1.5">
              {[
                "New signup from acme.co",
                "Invoice #1042 paid",
                "Deploy succeeded",
              ].map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded bg-muted/50 px-2 py-1"
                >
                  <div className="size-1.5 rounded-full bg-green-500" />
                  <span className="text-[9px] text-muted-foreground">
                    {msg}
                  </span>
                </div>
              ))}
            </div>
          </ScreenCard>

          <ScreenCard
            title="Integrations"
            className="right-2 top-0 w-40 md:right-8 md:w-44"
            delay={1}
          >
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex size-8 items-center justify-center rounded-lg bg-muted"
                >
                  <div className="size-4 rounded bg-primary/20" />
                </div>
              ))}
            </div>
          </ScreenCard>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}
