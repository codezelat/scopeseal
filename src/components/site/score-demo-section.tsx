"use client";

import { motion, useReducedMotion } from "motion/react";
import { SealScoreRing } from "@/components/brand/seal-score-ring";
import { Reveal } from "@/components/animations/reveal";

const categories = [
  { label: "Deliverables", score: 85, color: "bg-clear" },
  { label: "Timeline", score: 72, color: "bg-clear" },
  { label: "Revisions", score: 45, color: "bg-risk" },
  { label: "Payment terms", score: 60, color: "bg-risk" },
  { label: "Scope boundaries", score: 30, color: "bg-missing" },
  { label: "Communication", score: 78, color: "bg-clear" },
];

export function ScoreDemoSection() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              See what a result looks like
            </h2>
            <p className="mt-3 text-muted-foreground">
              A sample Scope Clarity Score with category breakdown.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-16">
            {/* Score ring */}
            <div className="shrink-0">
              <SealScoreRing score={72} size={200} />
            </div>

            {/* Category bars */}
            <div className="flex-1 space-y-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, x: 12 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={reduced ? { duration: 0 } : { delay: i * 0.08, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{cat.score}/100</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${cat.color}`}
                      initial={reduced ? { width: `${cat.score}%` } : { width: 0 }}
                      whileInView={{ width: `${cat.score}%` }}
                      viewport={{ once: true }}
                      transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
