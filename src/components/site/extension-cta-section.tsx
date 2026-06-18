"use client";

import { ExternalLink, Shield } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";

export function ExtensionCtaSection() {
  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seal-violet/8 blur-[100px]" />
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Check briefs in one click
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              The ScopeSeal Chrome extension lets you highlight any brief or client
              message and get an instant clarity score.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <MagneticButton>
                <Button size="lg" className="bg-seal-gradient text-white gap-2" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Add to Chrome
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </MagneticButton>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="size-3" />
              Capture selected text only after your action. Nothing auto-uploaded.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
