import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleActions } from "./role-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Users" };
const PAGE_SIZE = 20;

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim().slice(0, 120) ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const where = q ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }] } : {};
  const total = await db.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1), totalPages);
  const users = await db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { _count: { select: { reviews: true } } } });
  const pageHref = (nextPage: number) => `/admin/users?page=${nextPage}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="space-y-10">
      <header><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Administration</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Users</h1><p className="mt-2 text-sm text-muted-foreground">Accounts, roles, and review totals.</p></header>
      <form className="flex max-w-xl flex-col gap-2 sm:flex-row" action="/admin/users" method="get">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input name="q" maxLength={120} placeholder="Search users" defaultValue={q} className="pl-9" aria-label="Search by name or email" /></div><Button type="submit" variant="outline">Search</Button>{q ? <Button variant="ghost" asChild><Link href="/admin/users">Clear</Link></Button> : null}
      </form>
      <section aria-labelledby="user-list-heading">
        <div className="flex items-end justify-between gap-4"><h2 id="user-list-heading" className="font-display text-xl font-semibold">{total} {total === 1 ? "user" : "users"}</h2>{q ? <p className="truncate text-xs text-muted-foreground">Matching “{q}”</p> : null}</div>
        <div className="mt-5 border-t border-border">
          {users.length ? users.map((user) => <div key={user.id} className="grid gap-3 border-b border-border py-5 lg:grid-cols-[1fr_1.35fr_90px_90px_110px_auto] lg:items-center">
            <div className="min-w-0"><p className="truncate text-sm font-medium">{user.name || "No name"}</p><p className="mt-1 truncate text-xs text-muted-foreground lg:hidden">{user.email}</p></div>
            <p className="hidden truncate text-sm text-muted-foreground lg:block">{user.email}</p>
            <span className="w-fit rounded-full border border-border px-2 py-1 text-xs font-medium">{user.role === "ADMIN" ? "Admin" : "Member"}</span>
            <span className="text-xs text-muted-foreground">{user._count.reviews} {user._count.reviews === 1 ? "review" : "reviews"}</span>
            <span className="text-xs text-muted-foreground">{user.createdAt.toLocaleDateString()}</span>
            <RoleActions userId={user.id} currentRole={user.role} />
          </div>) : <p className="border-b border-border py-8 text-sm text-muted-foreground">No users found.</p>}
        </div>
        {totalPages > 1 ? <nav className="mt-6 flex items-center justify-between" aria-label="User pages"><Button variant="outline" size="sm" asChild={page > 1} disabled={page <= 1}>{page > 1 ? <Link href={pageHref(page - 1)}>Previous</Link> : "Previous"}</Button><span className="text-xs text-muted-foreground">{page} of {totalPages}</span><Button variant="outline" size="sm" asChild={page < totalPages} disabled={page >= totalPages}>{page < totalPages ? <Link href={pageHref(page + 1)}>Next</Link> : "Next"}</Button></nav> : null}
      </section>
    </div>
  );
}
