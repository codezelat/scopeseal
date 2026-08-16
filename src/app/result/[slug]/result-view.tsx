"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, Download, Link2Off, Plus, Share2, Sparkles, Trash2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/engine";
import { resultToMarkdown } from "@/lib/export";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { SealScoreRing } from "@/components/brand/seal-score-ring";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AiEnhanceResult { rewrittenScope: string; improvements: string[] }
interface ResultViewProps {
  result: AnalysisResult;
  reviewId: string;
  shareSlug: string;
  projectType: string;
  isOwner: boolean;
  initialIsShared: boolean;
  aiEnabled?: boolean;
  scopeText?: string;
}

const bandConfig = {
  clear: { label: "Clear scope", copy: "Ready to move forward.", color: "text-clear" },
  review: { label: "Needs review", copy: "A few details need attention.", color: "text-risk" },
  risky: { label: "High risk", copy: "Resolve key gaps before starting.", color: "text-missing" },
} as const;

function scoreColor(score: number): string {
  if (score >= 70) return "text-clear";
  if (score >= 40) return "text-risk";
  return "text-missing";
}

function progressColor(score: number): string {
  if (score >= 70) return "bg-clear";
  if (score >= 40) return "bg-risk";
  return "bg-missing";
}

function severityColor(severity: string): string {
  if (severity === "high") return "text-missing";
  if (severity === "medium") return "text-risk";
  return "text-muted-foreground";
}

export function ResultView({
  result,
  reviewId,
  shareSlug,
  projectType,
  isOwner,
  initialIsShared,
  aiEnabled = false,
  scopeText = "",
}: ResultViewProps) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiEnhanceResult | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [isShared, setIsShared] = useState(initialIsShared);
  const [sharing, setSharing] = useState(false);
  const band = bandConfig[result.band];
  const markdown = resultToMarkdown(result, projectType);

  const copyText = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      toast.success("Copied");
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy");
    }
  }, []);

  function downloadReport() {
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `scopeseal-${shareSlug}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function enhanceScope() {
    setAiLoading(true);
    try {
      const response = await fetch("/api/analyze/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scopeText, projectType }),
      });
      const data = (await response.json()) as AiEnhanceResult & { error?: string };
      if (!response.ok) return toast.error(data.error ?? "AI enhancement failed");
      setAiResult(data);
      setAiOpen(true);
    } catch {
      toast.error("AI enhancement failed");
    } finally {
      setAiLoading(false);
    }
  }

  async function deleteReview() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!response.ok) return toast.error("Could not delete review");
      window.location.assign("/app/reviews");
    } catch {
      toast.error("Could not delete review");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleSharing() {
    setSharing(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}/share`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isShared: !isShared }) });
      const data = await response.json() as { error?: string; isShared?: boolean };
      if (!response.ok || typeof data.isShared !== "boolean") throw new Error(data.error ?? "Could not update sharing");
      setIsShared(data.isShared);
      toast.success(data.isShared ? "Share link enabled" : "Share link disabled");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update sharing"); }
    finally { setSharing(false); }
  }

  const outputs = [
    ["internal", "Risk summary", result.outputs.internalRiskSummary],
    ["client", "Client note", result.outputs.clientFriendlyNote],
    ["proposal", "Proposal", result.outputs.proposalAdditionalInfo],
    ["rewrite", "Rewritten", result.outputs.rewrittenScope],
  ] as const;

  return (
    <div>
      <Reveal>
        <section className="grid items-center gap-8 border-b border-border pb-10 md:grid-cols-[240px_1fr] md:gap-12">
          <div className="flex justify-center md:justify-start">
            <SealScoreRing score={result.score} band={result.band} size={190} />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Scope analysis</p>
            <h1 className={cn("mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl", band.color)}>{band.label}</h1>
            <p className="mt-3 text-muted-foreground">{band.copy}</p>
            <p className="mt-5 text-sm capitalize text-muted-foreground">{projectType.replaceAll("-", " ")} · {result.wordCount} words</p>
          </div>
        </section>
      </Reveal>

      {result.sensitiveWarning ? (
        <p className="mt-5 border-l-2 border-risk pl-3 text-sm text-muted-foreground">This brief may contain sensitive content.</p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-border py-5" aria-label="Result actions">
        <Button variant="outline" size="sm" onClick={() => copyText(markdown, "report")}><Copy className="size-4" />{copied === "report" ? "Copied" : "Copy"}</Button>
        <Button variant="outline" size="sm" onClick={downloadReport}><Download className="size-4" />Download</Button>
        {isShared ? <Button variant="outline" size="sm" onClick={() => copyText(window.location.href, "share")}><Share2 className="size-4" />{copied === "share" ? "Copied" : "Share"}</Button> : null}
        {isOwner ? <Button variant="outline" size="sm" onClick={toggleSharing} disabled={sharing}>{isShared ? <Link2Off className="size-4" /> : <Share2 className="size-4" />}{sharing ? "Saving..." : isShared ? "Make private" : "Enable sharing"}</Button> : null}
        <Button variant="outline" size="sm" asChild><a href="/analyze"><Plus className="size-4" />New</a></Button>
        {aiEnabled && scopeText ? <Button size="sm" onClick={enhanceScope} disabled={aiLoading}><Sparkles className="size-4" />{aiLoading ? "Enhancing..." : "Improve with AI"}</Button> : null}
        {isOwner ? (
          <Dialog>
            <DialogTrigger asChild><Button variant="ghost" size="sm" className="ml-auto text-destructive hover:text-destructive"><Trash2 className="size-4" />Delete</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Delete this review?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
              <DialogFooter><DialogClose asChild><Button variant="outline" disabled={deleting}>Cancel</Button></DialogClose><Button variant="destructive" onClick={deleteReview} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-12 py-12 lg:grid-cols-[1fr_0.92fr]">
        <Reveal>
          <section aria-labelledby="breakdown-heading">
            <h2 id="breakdown-heading" className="mb-5 font-display text-xl font-semibold">Breakdown</h2>
            <div className="border-t border-border">
              {result.categories.map((category, index) => (
                <div key={category.id} className="grid grid-cols-[1fr_52px] items-center gap-4 border-b border-border py-4">
                  <div>
                    <div className="mb-2 text-sm font-medium">{category.label}</div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={cn("h-full rounded-full", progressColor(category.score))}
                        initial={reduced ? { width: `${category.score}%` } : { width: 0 }}
                        whileInView={{ width: `${category.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : index * 0.04 }}
                      />
                    </div>
                  </div>
                  <span className={cn("text-right font-mono text-lg font-semibold tabular-nums", scoreColor(category.score))}>{category.score}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section aria-labelledby="findings-heading">
            <h2 id="findings-heading" className="mb-5 font-display text-xl font-semibold">Findings</h2>
            <div className="border-t border-border">
              {result.missing.length === 0 && result.risks.length === 0 ? <p className="border-b border-border py-5 text-sm text-muted-foreground">No major gaps detected.</p> : null}
              {result.missing.map((item) => (
                <details key={item.id} className="group border-b border-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span>{item.label}</span><span className={cn("text-xs capitalize", severityColor(item.severity))}>{item.severity}</span>
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-muted-foreground">{item.guidance}</p>
                </details>
              ))}
              {result.risks.map((risk, index) => (
                <details key={`${risk.phrase}-${index}`} className="group border-b border-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span>&ldquo;{risk.phrase}&rdquo;</span><span className={cn("text-xs capitalize", severityColor(risk.severity))}>{risk.severity}</span>
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-muted-foreground">{risk.guidance}</p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {result.suggestions.length > 0 ? (
        <Reveal>
          <section className="border-y border-border py-8" aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="mb-5 font-display text-xl font-semibold">Next steps</h2>
            <ol className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {result.suggestions.slice(0, 4).map((suggestion, index) => <li key={suggestion} className="flex gap-3 text-sm leading-6"><span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span>{suggestion}</span></li>)}
            </ol>
            {result.suggestions.length > 4 ? (
              <details className="mt-6 border-t border-border pt-4">
                <summary className="w-fit cursor-pointer list-none text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring">Show {result.suggestions.length - 4} more</summary>
                <ol className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {result.suggestions.slice(4).map((suggestion, index) => <li key={suggestion} className="flex gap-3 text-sm leading-6"><span className="font-mono text-muted-foreground">{String(index + 5).padStart(2, "0")}</span><span>{suggestion}</span></li>)}
                </ol>
              </details>
            ) : null}
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="pt-12" aria-labelledby="outputs-heading">
          <h2 id="outputs-heading" className="mb-5 font-display text-xl font-semibold">Ready to use</h2>
          <Tabs defaultValue="internal">
            <TabsList variant="line" className="mb-4 h-auto max-w-full justify-start overflow-x-auto">
              {outputs.map(([id, label]) => <TabsTrigger key={id} value={id}>{label}</TabsTrigger>)}
            </TabsList>
            {outputs.map(([id, , content]) => (
              <TabsContent key={id} value={id}>
                <div className="relative border border-border bg-card p-5 pr-16">
                  <p className="whitespace-pre-wrap text-sm leading-7">{content}</p>
                  <Button variant="ghost" size="icon-sm" className="absolute right-3 top-3" onClick={() => copyText(content, id)} aria-label={`Copy ${id} output`}>
                    {copied === id ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </Reveal>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Improved scope</DialogTitle><DialogDescription>A clearer version of your brief.</DialogDescription></DialogHeader>
          {aiResult ? <div className="max-h-[60vh] overflow-y-auto"><p className="whitespace-pre-wrap text-sm leading-7">{aiResult.rewrittenScope}</p>{aiResult.improvements.length > 0 ? <ul className="mt-5 border-t border-border pt-4">{aiResult.improvements.map((item) => <li key={item} className="flex gap-2 py-1 text-sm"><Check className="mt-0.5 size-4 flex-none text-clear" />{item}</li>)}</ul> : null}</div> : null}
          <DialogFooter><Button variant="outline" onClick={() => aiResult && copyText(aiResult.rewrittenScope, "ai")}>{copied === "ai" ? "Copied" : "Copy"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
