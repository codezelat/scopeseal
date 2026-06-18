"use client";

import { ClipboardCheck, Search, FileCheck2 } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Capture or paste a brief",
    description: "Paste a project brief, client email, or proposal into ScopeSeal — or capture it with the Chrome extension.",
  },
  {
    number: "02",
    icon: Search,
    title: "Get a 0–100 clarity score",
    description: "The engine analyzes 9 categories: deliverables, timeline, revisions, payment terms, and more. See every gap.",
  },
  {
    number: "03",
    icon: FileCheck2,
    title: "Ship a tighter scope",
    description: "Get copy-ready rewrite suggestions and templates to close the gaps before work begins.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps from vague brief to sealed scope.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-seal-violet/30 hover:shadow-lg">
                {/* Number badge */}
                <div className="bg-seal-gradient mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                  {step.number}
                </div>
                <step.icon className="mb-3 size-8 text-seal-violet" />
                <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
