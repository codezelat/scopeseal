import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { RoleActions } from "./role-actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        _count: { select: { reviews: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage user accounts and roles.
        </p>
      </div>

      <form className="flex items-center gap-2" action="/admin/users" method="get">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search by email or name..."
            defaultValue={q}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
        {q && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">Clear</Link>
          </Button>
        )}
      </form>

      <Card>
        <CardHeader>
          <CardTitle>
            {total} user{total !== 1 ? "s" : ""}
            {q && ` matching "${q}"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.name ?? "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={u.role === "ADMIN" ? "default" : "secondary"}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{u._count.reviews}</TableCell>
                    <TableCell>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <RoleActions userId={u.id} currentRole={u.role} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
                    Previous
                  </Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
