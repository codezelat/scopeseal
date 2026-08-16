"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Shield,
  LogOut,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SealLogo } from "@/components/brand/seal-logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Reviews", href: "/app/reviews", icon: FileText },
  { label: "Templates", href: "/app/templates", icon: LayoutTemplate },
  { label: "Settings", href: "/app/settings", icon: Settings },
] as const;

interface AppNavigationProps {
  name: string;
  email: string;
  isAdmin: boolean;
}

function isActivePath(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === href : pathname.startsWith(href);
}

export function AppNavigation({ name, email, isAdmin }: AppNavigationProps) {
  const pathname = usePathname();
  const initial = (name || email || "U").charAt(0).toUpperCase();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-20 items-center border-b border-sidebar-border px-5">
          <Link href="/app" aria-label="ScopeSeal dashboard" className="text-sidebar-foreground">
            <SealLogo withWordmark size={23} />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Application navigation">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md border-l-2 px-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-sidebar-accent text-sidebar-foreground"
                    : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className="flex min-h-11 items-center gap-3 rounded-md border-l-2 border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Shield className="size-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton className="w-full" />
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <Link href="/app" aria-label="ScopeSeal dashboard" className="text-foreground">
          <SealLogo withWordmark size={21} />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open account menu"
              >
                {initial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="px-2 py-2">
                <span className="block truncate text-sm text-foreground">{name || "Account"}</span>
                <span className="block truncate font-normal">{email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="min-h-10 px-2">
                <Link href="/app/settings"><UserRound />Settings</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <DropdownMenuItem asChild className="min-h-10 px-2">
                  <Link href="/admin"><Shield />Admin</Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="min-h-10 px-2"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut />Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 md:hidden"
        aria-label="Application navigation"
      >
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="size-[18px]" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
