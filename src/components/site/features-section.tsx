"use client";

import { BarChart3, AlertTriangle, ShieldAlert, Copy } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

const features = [
  {
    icon: BarChart3,
    title: "Scope Clarity Score",
    description: "A 0–100 score across 9 categories — instant clarity on how complete a brief really is.",
    color: "text-seal-violet",
  },
  {
    icon: AlertTriangle,
    title: "Missing-item detector",
    description: "Flags sections like deliverables, timeline, and payment terms that are absent or empty.",
    color: "text-clear",
  },
  {
    icon: ShieldAlert,
    title: "Risky-wording detector",
    description: "Catches vague language — \"etc.\", \"as needed\", \"TBD\" — that hides scope creep.",
    color: "text-risk",
  },
  {
    icon: Copy,
    title: "Copy-ready outputs",
    description: "Get rewrite suggestions and templates you can paste straight into your proposal or SOW.",
    color: "text-missing",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to seal the scope
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four layers of analysis to protect your time and margins.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <div className="group flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-seal-violet/30 hover:shadow-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className={`size-5 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
