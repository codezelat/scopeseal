"use client";

import {
  Globe,
  Search,
  Share2,
  Palette,
  Code2,
  Smartphone,
  Wrench,
  FileText,
} from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

const projectTypes = [
  { name: "Website", icon: Globe },
  { name: "SEO", icon: Search },
  { name: "Social Media Marketing", icon: Share2 },
  { name: "Branding", icon: Palette },
  { name: "Custom Software", icon: Code2 },
  { name: "Mobile App", icon: Smartphone },
  { name: "Maintenance / Support", icon: Wrench },
  { name: "General Service", icon: FileText },
];

export function ProjectTypesSection() {
  return (
    <section id="project-types" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Built for every project type
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tailored analysis for 8 common agency and freelance project types.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {projectTypes.map((type, i) => (
            <Reveal key={type.name} delay={i * 0.05}>
              <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-seal-violet/30 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <type.icon className="size-6 text-seal-violet" />
                </div>
                <span className="text-sm font-medium">{type.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
