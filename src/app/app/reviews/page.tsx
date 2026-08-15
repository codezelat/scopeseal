import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { PROJECT_TYPE_OPTIONS } from "@/lib/engine";
import { ReviewList } from "@/components/product/review-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Reviews" };
const PAGE_SIZE = 20;
interface ReviewsParams { page?: string; q?: string; type?: string }

function pageHref(page: number, query: string, type: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query) params.set("q", query);
  if (type) params.set("type", type);
  const value = params.toString();
  return value ? `/app/reviews?${value}` : "/app/reviews";
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<ReviewsParams> }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 120) ?? "";
  const type = PROJECT_TYPE_OPTIONS.some((option) => option.value === params.type) ? params.type! : "";
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const where: Prisma.ReviewWhereInput = {
    userId: user.id,
    ...(type ? { projectType: type } : {}),
    ...(query ? { inputText: { contains: query, mode: "insensitive" } } : {}),
  };
  const total = await db.review.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const reviews = await db.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: { id: true, projectType: true, score: true, band: true, inputText: true, shareSlug: true, createdAt: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Reviews</h1>
          <p className="mt-2 text-sm text-muted-foreground">{total} saved</p>
        </div>
        <Button asChild><Link href="/analyze">New analysis</Link></Button>
      </header>

      <form className="mb-7 flex flex-col gap-2 sm:flex-row" action="/app/reviews">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search brief text</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input name="q" defaultValue={query} placeholder="Search briefs" className="pl-9" />
        </label>
        <label>
          <span className="sr-only">Filter by project type</span>
          <select name="type" defaultValue={type} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-44">
            <option value="">All types</option>
            {PROJECT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <Button type="submit" variant="outline">Filter</Button>
      </form>

      {reviews.length > 0 ? <ReviewList reviews={reviews} detailed /> : (
        <div className="border-y border-border py-14 text-center">
          <p className="text-sm font-medium">No matching reviews</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter.</p>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-8 flex items-center justify-end gap-2" aria-label="Review pages">
          {page > 1 ? <Button variant="outline" size="sm" asChild><Link href={pageHref(page - 1, query, type)}><ChevronLeft className="size-4" />Previous</Link></Button> : <Button variant="outline" size="sm" disabled><ChevronLeft className="size-4" />Previous</Button>}
          <span className="px-2 text-sm text-muted-foreground">{page} / {totalPages}</span>
          {page < totalPages ? <Button variant="outline" size="sm" asChild><Link href={pageHref(page + 1, query, type)}>Next<ChevronRight className="size-4" /></Link></Button> : <Button variant="outline" size="sm" disabled>Next<ChevronRight className="size-4" /></Button>}
        </nav>
      ) : null}
    </main>
  );
}
