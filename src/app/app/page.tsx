import Link from "next/link";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  FileText,
  LayoutTemplate,
  Settings,
  Sparkles,
} from "lucide-react";

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function bandColor(band: string): string {
  if (band === "clear")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (band === "review")
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
}

export default async function AppHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const recentReviews = await db.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      projectType: true,
      score: true,
      band: true,
      shareSlug: true,
      createdAt: true,
    },
  });

  const totalReviews = await db.review.count({
    where: { userId: user.id },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {user.name ?? "there"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {totalReviews > 0
            ? `You've analyzed ${totalReviews} scope${totalReviews === 1 ? "" : "s"} so far.`
            : "Start your first scope analysis below."}
        </p>
      </div>

      {/* Primary CTA */}
      <Card className="mb-8 overflow-hidden">
        <div className="flex flex-col items-center gap-4 bg-seal-gradient p-8 text-center text-white sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">
              Analyze a new scope
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Paste your project brief and get an instant clarity score with
              detailed feedback.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="shrink-0 font-semibold"
            asChild
          >
            <Link href="/analyze">
              <Sparkles className="mr-1.5 size-4" />
              Start analysis
            </Link>
          </Button>
        </div>
      </Card>

      {/* Quick links */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Link href="/app/reviews" className="group">
          <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
            <FileText className="size-5 text-seal-violet" />
            <div className="flex-1">
              <p className="text-sm font-medium">Reviews</p>
              <p className="text-xs text-muted-foreground">
                {totalReviews} total
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        </Link>
        <Link href="/app/templates" className="group">
          <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
            <LayoutTemplate className="size-5 text-seal-violet" />
            <div className="flex-1">
              <p className="text-sm font-medium">Templates</p>
              <p className="text-xs text-muted-foreground">Browse library</p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        </Link>
        <Link href="/app/settings" className="group">
          <Card className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
            <Settings className="size-5 text-seal-violet" />
            <div className="flex-1">
              <p className="text-sm font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">
                Account & preferences
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        </Link>
      </div>

      {/* Recent reviews */}
      {recentReviews.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Recent reviews
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/reviews">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <Link
                key={review.id}
                href={`/result/${review.shareSlug}`}
                className="group block"
              >
                <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/50">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${scoreColor(review.score)} bg-muted`}
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
                        {review.band === "clear"
                          ? "Clear"
                          : review.band === "review"
                            ? "Review"
                            : "Risky"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
