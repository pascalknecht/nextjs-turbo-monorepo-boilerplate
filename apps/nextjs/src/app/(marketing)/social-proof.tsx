import React from "react";

export function SocialProof() {
  const companies = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Umbrella",
    "Hooli",
    "Pied Piper",
  ];

  const stats = [
    { value: "3.2M", label: "events processed weekly" },
    { value: "54%", label: "faster first production launch" },
    { value: "99.95%", label: "starter uptime across active deployments" },
  ];

  return (
    <section className="border-t border-border py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by engineering and product teams
          </p>

          <div className="grid gap-4 border-y border-border py-6 md:grid-cols-3 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            {companies.map((company) => (
              <div key={company} className="font-medium">
                {company}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Based on anonymized customer usage and deployment telemetry.
          </p>
        </div>
      </div>
    </section>
  );
}
