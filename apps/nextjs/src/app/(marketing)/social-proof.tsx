import React from "react";

export function SocialProof() {
  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {[
            "Acme Corp",
            "Globex",
            "Initech",
            "Umbrella",
            "Hooli",
            "Pied Piper",
          ].map((company) => (
            <div
              key={company}
              className="text-lg font-semibold text-muted-foreground/50"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
