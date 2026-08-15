import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReviewListItem {
  id: string;
  projectType: string;
  score: number;
  band: string;
  shareSlug: string;
  createdAt: Date;
  inputText?: string;
}

function bandLabel(band: string): string {
  if (band === "clear") return "Clear";
  if (band === "review") return "Review";
  return "Risky";
}

function scoreClass(score: number): string {
  if (score >= 70) return "text-clear";
  if (score >= 40) return "text-risk";
  return "text-missing";
}

function bandClass(band: string): string {
  if (band === "clear") return "border-clear/35 bg-clear/[0.08] text-clear";
  if (band === "review") return "border-risk/35 bg-risk/[0.08] text-risk";
  return "border-missing/35 bg-missing/[0.08] text-missing";
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function ReviewList({
  reviews,
  detailed = false,
}: {
  reviews: ReviewListItem[];
  detailed?: boolean;
}) {
  return (
    <div role="table" aria-label="Scope reviews" className="border-t border-border">
      <div
        role="row"
        className={cn(
          "hidden min-h-12 items-center gap-4 border-b border-border text-xs font-medium text-muted-foreground sm:grid",
          detailed
            ? "grid-cols-[72px_120px_88px_minmax(180px,1fr)_110px_20px]"
            : "grid-cols-[72px_minmax(140px,1fr)_96px_120px_20px]",
        )}
      >
        <span role="columnheader">Score</span>
        <span role="columnheader">Project type</span>
        <span role="columnheader">Clarity</span>
        {detailed ? <span role="columnheader">Brief</span> : null}
        <span role="columnheader">Date</span>
        <span className="sr-only" role="columnheader">Open</span>
      </div>

      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/result/${review.shareSlug}`}
          role="row"
          className={cn(
            "group grid min-h-20 items-center gap-x-3 gap-y-2 border-b border-border py-4 transition-colors hover:bg-muted/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4 sm:px-0",
            detailed
              ? "grid-cols-[64px_minmax(0,1fr)_auto] sm:grid-cols-[72px_120px_88px_minmax(180px,1fr)_110px_20px]"
              : "grid-cols-[64px_minmax(0,1fr)_auto] sm:grid-cols-[72px_minmax(140px,1fr)_96px_120px_20px]",
          )}
        >
          <span role="cell" className={cn("font-mono text-xl font-semibold tabular-nums", scoreClass(review.score))}>
            {review.score}
          </span>
          <span role="cell" className="min-w-0 text-sm font-medium capitalize">
            {review.projectType.replaceAll("-", " ")}
          </span>
          <span
            role="cell"
            className={cn("w-fit rounded-md border px-2 py-1 text-xs font-medium", bandClass(review.band))}
          >
            {bandLabel(review.band)}
          </span>
          {detailed ? (
            <span role="cell" className="col-span-3 line-clamp-2 text-sm leading-5 text-muted-foreground sm:col-span-1">
              {review.inputText}
            </span>
          ) : null}
          <span role="cell" className="col-start-2 text-xs text-muted-foreground sm:col-start-auto sm:text-sm">
            {formatDate(review.createdAt)}
          </span>
          <span role="cell" className="col-start-3 row-start-2 justify-self-end sm:col-start-auto sm:row-start-auto">
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
