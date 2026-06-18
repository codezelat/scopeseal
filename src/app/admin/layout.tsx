import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { SealLogo } from "@/components/brand/seal-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  LayoutDashboard,
  Users,
  Settings,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "AI Configuration", href: "/admin/ai-config", icon: Sparkles },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/admin" className="flex items-center">
            <SealLogo withWordmark size={22} />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to App
          </Link>
          <div className="my-2 border-t border-border" />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-seal-gradient text-xs font-bold text-white">
              {(user.name ?? user.email ?? "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
          <Link href="/admin" className="flex items-center">
            <SealLogo withWordmark size={22} />
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                title={item.label}
              >
                <item.icon className="size-4" />
              </Link>
            ))}
          </nav>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
