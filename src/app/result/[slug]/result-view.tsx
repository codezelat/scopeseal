"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Copy,
  Download,
  Share2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/engine";
import { resultToMarkdown } from "@/lib/export";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SealScoreRing } from "@/components/brand/seal-score-ring";
import { Reveal } from "@/components/animations/reveal";
import { CountUp } from "@/components/animations/count-up";
import { toast } from "sonner";

interface ResultViewProps {
  result: AnalysisResult;
  reviewId: string;
  shareSlug: string;
  projectType: string;
  isOwner: boolean;
}

const bandConfig: Record<
  string,
  { label: string; color: string; bg: string; desc: string }
> = {
  clear: {
    label: "Clear Scope",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    desc: "Your scope covers the essentials well.",
  },
  review: {
    label: "Needs Review",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    desc: "Some important details are missing or vague.",
  },
  risky: {
    label: "High Risk",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    desc: "Significant gaps that could lead to scope creep.",
  },
};

const severityConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  high: {
    label: "High",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  low: {
    label: "Low",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
  },
};

function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function getProgressColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function highlightPhrase(text: string, phrase: string): React.ReactNode {
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200/50 px-0.5 text-amber-900 dark:bg-amber-800/40 dark:text-amber-200">
        {text.slice(idx, idx + phrase.length)}
      </mark>
      {text.slice(idx + phrase.length)}
    </>
  );
}

export function ResultView({
  result,
  reviewId,
  shareSlug,
  projectType,
  isOwner,
}: ResultViewProps) {
  const reduced = useReducedMotion();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const band = bandConfig[result.band] ?? bandConfig.risky;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/result/${shareSlug}`;

  const markdown = resultToMarkdown(result, projectType);

  const copyToClipboard = useCallback(
    async (text: string, field: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedField(null), 2000);
      } catch {
        toast.error("Failed to copy");
      }
    },
    [],
  );

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scopeseal-report-${shareSlug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, shareSlug]);

  const copyShareLink = useCallback(() => {
    copyToClipboard(shareUrl, "share");
  }, [copyToClipboard, shareUrl]);

  const sortedMissing = [...result.missing].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  const outputTabs = [
    {
      id: "internal",
      label: "Internal Risk Summary",
      content: result.outputs.internalRiskSummary,
    },
    {
      id: "client",
      label: "Client-Friendly Note",
      content: result.outputs.clientFriendlyNote,
    },
    {
      id: "proposal",
      label: "Proposal Addition",
      content: result.outputs.proposalAdditionalInfo,
    },
    {
      id: "rewritten",
      label: "Rewritten Scope",
      content: result.outputs.rewrittenScope,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Score hero */}
      <Reveal>
        <section className="flex flex-col items-center text-center">
          <SealScoreRing
            score={result.score}
            band={result.band}
            size={220}
            className="mb-4"
          />
          <h1 className={cn("font-display text-2xl font-bold", band.color)}>
            {band.label}
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Your scope scores{" "}
            <span className={cn("font-mono font-bold", getScoreColor(result.score))}>
              <CountUp value={result.score} />
            </span>
            /100 — {band.desc}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {result.wordCount} words
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {projectType}
            </Badge>
          </div>
          {result.sensitiveWarning && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0" />
              This scope may contain sensitive or confidential content.
            </div>
          )}
        </section>
      </Reveal>

      {/* Quick actions */}
      <Reveal delay={0.1}>
        <section className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(markdown, "report")}
            className="gap-1.5"
          >
            <Copy className="size-3.5" />
            {copiedField === "report" ? "Copied!" : "Copy report"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadMarkdown}
            className="gap-1.5"
          >
            <Download className="size-3.5" />
            Download .md
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyShareLink}
            className="gap-1.5"
          >
            {copiedField === "share" ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            {copiedField === "share" ? "Link copied!" : "Share link"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href="/analyze">
              <Plus className="size-3.5" />
              New analysis
            </a>
          </Button>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const res = await fetch(`/api/reviews/${reviewId}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    toast.success("Review deleted");
                    window.location.href = "/app/reviews";
                  } else {
                    toast.error("Failed to delete");
                  }
                } catch {
                  toast.error("Failed to delete");
                }
              }}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          )}
        </section>
      </Reveal>

      <Separator />

      {/* Category breakdown */}
      <Reveal delay={0.15}>
        <section>
          <h2 className="mb-6 font-display text-xl font-semibold">
            Category Breakdown
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduced ? 0 : i * 0.08,
                  ease: "easeOut",
                }}
              >
                <Card className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span
                      className={cn(
                        "font-mono text-lg font-bold",
                        getScoreColor(cat.score),
                      )}
                    >
                      <CountUp value={cat.score} />
                    </span>
                  </div>
                  <motion.div
                    initial={reduced ? {} : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: reduced ? 0 : 0.3 + i * 0.08,
                      ease: "easeOut",
                    }}
                    style={{ transformOrigin: "left" }}
                  >
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getProgressColor(cat.score),
                        )}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </motion.div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Weight: {cat.weight.toFixed(1)}x
                    </span>
                    {cat.note && (
                      <span className="text-xs text-muted-foreground">
                        {cat.note}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Missing items */}
      {sortedMissing.length > 0 && (
        <Reveal delay={0.2}>
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold">
                Missing from your scope
              </h2>
              <Badge variant="secondary" className="font-mono">
                {sortedMissing.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {sortedMissing.map((item, i) => {
                const sev = severityConfig[item.severity] ?? severityConfig.medium;
                return (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <Card className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "mt-0.5 shrink-0 text-xs",
                            sev.bg,
                            sev.color,
                          )}
                        >
                          {sev.label}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.guidance}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* Risky phrasing */}
      {result.risks.length > 0 && (
        <Reveal delay={0.25}>
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold">
                Risky wording detected
              </h2>
              <Badge variant="secondary" className="font-mono">
                {result.risks.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {result.risks.map((risk, i) => {
                const sev =
                  severityConfig[risk.severity] ?? severityConfig.medium;
                return (
                  <Reveal key={`${risk.phrase}-${i}`} delay={i * 0.05}>
                    <Card className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "mt-0.5 shrink-0 text-xs",
                            sev.bg,
                            sev.color,
                          )}
                        >
                          {sev.label}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              &ldquo;{risk.phrase}&rdquo;
                            </p>
                            <span className="font-mono text-xs text-muted-foreground">
                              x{risk.count}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {highlightPhrase(risk.context, risk.phrase)}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {risk.guidance}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Reveal delay={0.3}>
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">
              Recommended actions
            </h2>
            <div className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <Separator />

      {/* Copy-ready outputs */}
      <Reveal delay={0.35}>
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">
            Copy-ready outputs
          </h2>
          <Tabs defaultValue="internal">
            <TabsList variant="line" className="mb-4 flex-wrap">
              {outputTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {outputTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Card className="relative p-4">
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {tab.content}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(tab.content, `output-${tab.id}`)
                    }
                    className="absolute top-3 right-3 gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    {copiedField === `output-${tab.id}` ? "Copied!" : "Copy"}
                  </Button>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </Reveal>

      {/* Footer CTA */}
      <Reveal delay={0.4}>
        <section className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
          <h3 className="font-display text-lg font-semibold">
            Want to analyze another scope?
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Test as many project briefs as you like. Each analysis gives you a
            fresh score and actionable insights.
          </p>
          <Button className="bg-seal-gradient text-white" asChild>
            <a href="/analyze">
              <ExternalLink className="mr-1.5 size-4" />
              Analyze a new scope
            </a>
          </Button>
        </section>
      </Reveal>
    </div>
  );
}
