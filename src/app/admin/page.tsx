import type { Metadata } from "next";
import { Calendar, FileText, TrendingUp, Users } from "lucide-react";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Overview" };

const bandMeta = {
  clear: { label: "Clear", bar: "bg-clear", text: "text-clear" },
  review: { label: "Review", bar: "bg-risk", text: "text-risk" },
  risky: { label: "Risky", bar: "bg-missing", text: "text-missing" },
} as const;

export default async function AdminOverviewPage() {
  // Server request time defines the rolling seven-day window.
  // eslint-disable-next-line react-hooks/purity
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalUsers, totalReviews, average, weekly, recent, counts] = await Promise.all([
    db.user.count(),
    db.review.count(),
    db.review.aggregate({ _avg: { score: true } }),
    db.review.count({ where: { createdAt: { gte: weekAgo } } }),
    db.review.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { email: true } } } }),
    db.review.groupBy({ by: ["band"], _count: { id: true } }),
  ]);
  const stats = [
    { label: "Users", value: totalUsers, icon: Users },
    { label: "Reviews", value: totalReviews, icon: FileText },
    { label: "Average", value: `${Math.round(average._avg.score ?? 0)}/100`, icon: TrendingUp },
    { label: "This week", value: weekly, icon: Calendar },
  ];
  const distribution = (Object.keys(bandMeta) as Array<keyof typeof bandMeta>).map((band) => {
    const count = counts.find((item) => item.band === band)?._count.id ?? 0;
    return { band, count, percent: totalReviews ? Math.round((count / totalReviews) * 100) : 0 };
  });

  return (
    <div className="space-y-12">
      <header><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Administration</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Overview</h1><p className="mt-2 text-sm text-muted-foreground">Platform activity at a glance.</p></header>

      <section aria-label="Platform statistics" className="grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => <div key={stat.label} className={cn("py-5 sm:px-5", index % 2 === 1 && "sm:border-l", index > 1 && "border-t sm:border-t", index > 0 && "max-sm:border-t", index === 2 && "lg:border-l lg:border-t-0", "border-border")}><div className="flex items-center justify-between text-sm text-muted-foreground"><span>{stat.label}</span><stat.icon className="size-4" /></div><p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{stat.value}</p></div>)}
      </section>

      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <section aria-labelledby="distribution-heading"><h2 id="distribution-heading" className="font-display text-xl font-semibold">Score distribution</h2><div className="mt-5 border-t border-border">{distribution.map((item) => { const meta = bandMeta[item.band]; return <div key={item.band} className="border-b border-border py-4"><div className="flex items-center justify-between text-sm"><span className={cn("font-medium", meta.text)}>{meta.label}</span><span className="font-mono text-muted-foreground">{item.count} · {item.percent}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", meta.bar)} style={{ width: `${item.percent}%` }} /></div></div>; })}</div></section>
        <section aria-labelledby="activity-heading"><h2 id="activity-heading" className="font-display text-xl font-semibold">Recent activity</h2><div className="mt-5 border-t border-border">{recent.length ? recent.map((review) => <div key={review.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border py-4 sm:grid-cols-[1.2fr_0.7fr_70px_1fr] sm:items-center"><div className="min-w-0"><p className="truncate text-sm font-medium capitalize">{review.projectType.replaceAll("-", " ")}</p><p className="mt-1 truncate text-xs text-muted-foreground sm:hidden">{review.user?.email ?? "Guest"}</p></div><span className={cn("font-mono text-lg font-semibold", bandMeta[review.band].text)}>{review.score}</span><span className="hidden text-xs capitalize text-muted-foreground sm:block">{bandMeta[review.band].label}</span><div className="hidden min-w-0 text-right sm:block"><p className="truncate text-xs text-muted-foreground">{review.user?.email ?? "Guest"}</p><p className="mt-1 text-xs text-muted-foreground">{review.createdAt.toLocaleDateString()}</p></div></div>) : <p className="border-b border-border py-6 text-sm text-muted-foreground">No reviews yet.</p>}</div></section>
      </div>
    </div>
  );
}
