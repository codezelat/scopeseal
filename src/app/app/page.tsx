import Link from "next/link";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { ReviewList } from "@/components/product/review-list";
import { Button } from "@/components/ui/button";

export default async function AppHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [recentReviews, totalReviews] = await Promise.all([
    db.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, projectType: true, score: true, band: true, shareSlug: true, createdAt: true },
    }),
    db.review.count({ where: { userId: user.id } }),
  ]);
  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-10">
        <p className="mb-2 text-sm text-muted-foreground">
          {totalReviews === 0 ? "Your workspace" : `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Welcome, {firstName}</h1>
      </header>

      <Link
        href="/analyze"
        className="group mb-14 flex min-h-28 items-center gap-4 rounded-lg bg-primary px-5 py-6 text-primary-foreground outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-7"
      >
        <span className="flex size-11 flex-none items-center justify-center rounded-md border border-white/25 bg-white/10">
          <FilePlus2 className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-semibold">Analyze a brief</span>
          <span className="mt-0.5 block text-sm text-white/75">Get a clarity score in seconds.</span>
        </span>
        <ArrowRight className="size-5 flex-none transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>

      <section aria-labelledby="recent-reviews">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 id="recent-reviews" className="font-display text-xl font-semibold">Recent reviews</h2>
          {totalReviews > 3 ? <Button variant="ghost" size="sm" asChild><Link href="/app/reviews">View all</Link></Button> : null}
        </div>
        {recentReviews.length > 0 ? <ReviewList reviews={recentReviews} /> : (
          <div className="border-y border-border py-12 text-center">
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Your first result will appear here.</p>
          </div>
        )}
      </section>
    </main>
  );
}
