"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Globe,
  Search,
  Share2,
  Palette,
  Code2,
  Smartphone,
  Wrench,
  Briefcase,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { PROJECT_TYPE_OPTIONS, type ProjectType } from "@/lib/engine";
import { countWords } from "@/lib/engine/text-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SealLoader } from "@/components/brand/seal-loader";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Search,
  Share2,
  Palette,
  Code2,
  Smartphone,
  Wrench,
  Briefcase,
};

const projectIcons: Record<string, string> = {
  website: "Globe",
  seo: "Search",
  social: "Share2",
  branding: "Palette",
  software: "Code2",
  mobile: "Smartphone",
  maintenance: "Wrench",
  general: "Briefcase",
};

const exampleBriefs: Record<string, string> = {
  website:
    "We need a 5-page marketing website for our SaaS product. The site should include a homepage, features page, pricing page, about us, and contact form. We want modern design with animations. The project should be completed in 4 weeks. Budget is $5,000.",
  seo:
    "We need an SEO audit and ongoing optimization for our e-commerce website. Monthly deliverables should include keyword research, on-page optimization, technical SEO fixes, and monthly reporting. We target 20 keywords initially.",
  social:
    "We need social media management for Instagram, Facebook, and LinkedIn. This includes content creation (15 posts/month), scheduling, community management, and monthly analytics reports. We want to increase followers by 20% in 3 months.",
  branding:
    "We need a complete brand identity package including logo design, color palette, typography selection, brand guidelines document, business card design, and letterhead. The style should be modern and professional.",
  software:
    "We need a custom web application for project management. Features include user authentication, task management, team collaboration, file sharing, and reporting dashboard. The tech stack should be React and Node.js.",
  mobile:
    "We need a cross-platform mobile app for iOS and Android. The app should include user registration, push notifications, in-app purchases, and social sharing. We need both frontend and backend development.",
  maintenance:
    "We need ongoing website maintenance and support. This includes monthly updates, security patches, bug fixes, performance monitoring, and up to 10 hours of development time per month.",
  general:
    "We need consulting services for our digital transformation project. This includes assessment of current systems, recommendations for improvement, implementation planning, and ongoing support during the transition.",
};

interface AnalyzeResponse {
  result?: {
    score: number;
    band: string;
  };
  reviewId?: string;
  shareSlug?: string;
  guestQuota?: { used: number; quota: number };
  error?: string;
  code?: string;
}

interface AnalyzeClientProps {
  initialText?: string;
  initialProjectType?: ProjectType;
}

export function AnalyzeClient({
  initialText = "",
  initialProjectType = "website",
}: AnalyzeClientProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [selectedType, setSelectedType] = useState<ProjectType>(initialProjectType);
  const [inputText, setInputText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const wordCount = countWords(inputText);

  const handleAnalyze = useCallback(async () => {
    if (inputText.trim().length < 50) {
      toast.error("Please enter at least 50 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, projectType: selectedType }),
      });
      const data: AnalyzeResponse = await res.json();
      if (!res.ok) {
        if (data.code === "QUOTA_EXCEEDED") {
          toast.error(
            "You've used all free analyses. Sign in for unlimited access.",
          );
        } else if (data.code === "RATE_LIMITED") {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else {
          toast.error(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      if (data.shareSlug) {
        router.push(`/result/${data.shareSlug}`);
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, selectedType, router]);

  const fillExample = useCallback(() => {
    setInputText(exampleBriefs[selectedType] ?? exampleBriefs.general);
  }, [selectedType]);

  return (
    <div className="space-y-10">
      {/* Project type selector */}
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Project type</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PROJECT_TYPE_OPTIONS.map((opt) => {
            const Icon = iconMap[projectIcons[opt.value]] ?? Briefcase;
            const isSelected = selectedType === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => setSelectedType(opt.value)}
                className={cn(
                  "relative min-h-32 flex flex-col items-start gap-3 rounded-md border p-4 text-left transition-[border-color,background-color,transform]",
                  isSelected
                    ? "border-primary bg-primary/[0.08]"
                    : "border-border bg-card hover:border-muted-foreground/60",
                )}
                whileHover={reduced ? {} : { scale: 1.02 }}
                whileTap={reduced ? {} : { scale: 0.98 }}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <motion.div
                    className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-white"
                    initial={reduced ? {} : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <Check className="size-3" />
                  </motion.div>
                )}
                <Icon
                  className={cn(
                    "size-5",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected && "text-foreground",
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {opt.blurb}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Input area */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your scope</h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {wordCount} words · {inputText.length} chars
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fillExample}
              className="gap-1.5 text-xs"
            >
              <FileText className="size-3.5" />
              Paste example
            </Button>
          </div>
        </div>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your project brief, scope of work, or proposal here…"
          maxLength={50_000}
          className="min-h-[220px] resize-y text-sm leading-6 sm:min-h-[280px]"
          aria-label="Scope text input"
        />
      </section>

      {/* Analyze button */}
      <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={loading || inputText.trim().length < 50}
            className="w-full px-8 sm:w-auto"
          >
            {loading ? (
              <>
                <SealLoader size={20} />
                Analyzing...
              </>
            ) : (
              "Analyze scope"
            )}
          </Button>
        {inputText.trim().length > 0 && inputText.trim().length < 50 && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 sm:self-end">
            <AlertTriangle className="size-3.5" />
            At least 50 characters required ({50 - inputText.trim().length} more
            needed)
          </p>
        )}
      </div>

      {/* What we check */}
      <section className="border-t border-border pt-8">
        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={showCategories}
        >
          <h2 className="text-lg font-semibold">What we check</h2>
          {showCategories ? (
            <ChevronUp className="size-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-5 text-muted-foreground" />
          )}
        </button>
        {showCategories && (
          <motion.div
            className="mt-4 grid border-t border-l border-border sm:grid-cols-3"
            initial={reduced ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {[
              { label: "Deliverables", desc: "Clear definition of what's included" },
              { label: "Timeline", desc: "Milestones, deadlines, and schedules" },
              { label: "Revisions", desc: "Number of rounds and change policies" },
              { label: "Payment", desc: "Terms, milestones, and invoicing" },
              { label: "Client Responsibilities", desc: "What the client must provide" },
              { label: "Technical Requirements", desc: "Stack, hosting, integrations" },
              { label: "Acceptance Criteria", desc: "How completion is determined" },
              { label: "Maintenance", desc: "Post-launch support and updates" },
              { label: "Exclusions", desc: "What's explicitly not included" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="border-r border-b border-border bg-card p-4"
              >
                <p className="text-sm font-medium">{cat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cat.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
