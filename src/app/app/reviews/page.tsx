import Link from "next/link";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "My Reviews",
};

const PAGE_SIZE = 20;

function bandLabel(band: string): string {
  if (band === "clear") return "Clear";
  if (band === "review") return "Review";
  return "Risky";
}

function bandColor(band: string): string {
  if (band === "clear")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (band === "review")
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        projectType: true,
        score: true,
        band: true,
        inputText: true,
        shareSlug: true,
        createdAt: true,
      },
    }),
    db.review.count({ where: { userId: user.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Reviews</h1>
        <Button className="bg-seal-gradient text-white" asChild>
          <a href="/analyze">New analysis</a>
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card py-16 text-center">
          <FileText className="size-10 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold">
              You haven&apos;t analyzed any scopes yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste your first project brief and get an instant clarity score.
            </p>
          </div>
          <Button className="bg-seal-gradient text-white" asChild>
            <a href="/analyze">Analyze a scope</a>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/result/${review.shareSlug}`}
                className="group block"
              >
                <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/50">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-lg font-mono text-lg font-bold ${scoreColor(review.score)} bg-muted`}
                  >
                    {review.score}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {review.projectType}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${bandColor(review.band)}`}
                      >
                        {bandLabel(review.band)}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {review.inputText.slice(0, 120)}
                      {review.inputText.length > 120 ? "…" : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/app/reviews?page=${page - 1}`}>
                    <ChevronLeft className="mr-1 size-4" />
                    Previous
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/app/reviews?page=${page + 1}`}>
                    Next
                    <ChevronRight className="ml-1 size-4" />
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
