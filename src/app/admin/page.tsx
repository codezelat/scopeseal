import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, TrendingUp, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

const bandLabels: Record<string, string> = {
  clear: "Clear",
  review: "Review",
  risky: "Risky",
};

const bandColors: Record<string, string> = {
  clear: "bg-emerald-500/10 text-emerald-600",
  review: "bg-amber-500/10 text-amber-600",
  risky: "bg-rose-500/10 text-rose-600",
};

export default async function AdminOverviewPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalReviews, avgScoreResult, reviewsThisWeek, recentReviews, bandCounts] =
    await Promise.all([
      db.user.count(),
      db.review.count(),
      db.review.aggregate({ _avg: { score: true } }),
      db.review.count({ where: { createdAt: { gte: weekAgo } } }),
      db.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { email: true } } },
      }),
      db.review.groupBy({
        by: ["band"],
        _count: { id: true },
      }),
    ]);

  const avgScore = Math.round(avgScoreResult._avg.score ?? 0);

  const bandData = ["clear", "review", "risky"].map((band) => {
    const found = bandCounts.find((b) => b.band === band);
    const count = found?._count.id ?? 0;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { band, count, pct };
  });

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Total Reviews", value: totalReviews, icon: FileText },
    { label: "Avg Score", value: `${avgScore}/100`, icon: TrendingUp },
    { label: "This Week", value: reviewsThisWeek, icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform analytics and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bandData.map((item) => (
              <div key={item.band} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {bandLabels[item.band] ?? item.band}
                  </span>
                  <span className="text-muted-foreground">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      item.band === "clear"
                        ? "bg-emerald-500"
                        : item.band === "review"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.max(item.pct, 1)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Project Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No reviews yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">{review.projectType}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {review.score}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={bandColors[review.band] ?? ""}
                      >
                        {bandLabels[review.band] ?? review.band}
                      </Badge>
                    </TableCell>
                    <TableCell>{review.user?.email ?? "Guest"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
