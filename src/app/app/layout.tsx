import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, getCurrentUser } from "@/auth";
import { SealLogo } from "@/components/brand/seal-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Reviews", href: "/app/reviews", icon: FileText },
  { label: "Templates", href: "/app/templates", icon: LayoutTemplate },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/app" className="flex items-center">
            <SealLogo withWordmark size={22} />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
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
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Shield className="size-4" />
              Admin
            </Link>
          )}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-seal-gradient text-xs font-bold text-white">
              {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — mobile */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
          <Link href="/app" className="flex items-center">
            <SealLogo withWordmark size={22} />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
