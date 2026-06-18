"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { SealLogo } from "@/components/brand/seal-logo";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations/reveal";

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Glow bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-seal-violet/10 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24">
        {/* Floating seal mark */}
        <motion.div
          className="mb-8"
          animate={
            reduced
              ? {}
              : { y: [0, -8, 0] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div className="bg-seal-gradient glow-seal flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
            <SealLogo size={36} />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <Reveal>
          <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="size-3" />
            Scope clarity for agencies
          </Badge>
        </Reveal>

        {/* H1 */}
        <Reveal delay={0.08}>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-seal-gradient">Seal</span> the gaps
            <br />
            before they become unpaid work.
          </h1>
        </Reveal>

        {/* Subcopy */}
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            ScopeSeal reviews project briefs, client messages, and proposals to find
            missing details, vague wording, and scope-creep risks — in seconds.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.24}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <MagneticButton>
              <Button size="lg" className="bg-seal-gradient text-white gap-2" asChild>
                <a href="#cta">
                  Analyze a brief
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </MagneticButton>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Add to Chrome
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>

        {/* Trust row */}
        <Reveal delay={0.32}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>9-category clarity score</span>
            <span className="text-border">·</span>
            <span>8 project types</span>
            <span className="text-border">·</span>
            <span>No legal claims</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
