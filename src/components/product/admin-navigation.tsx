"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ArrowLeft, LayoutDashboard, LogOut, Settings, Sparkles, Users } from "lucide-react";
import { SealLogo } from "@/components/brand/seal-logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "AI", href: "/admin/ai-config", icon: Sparkles },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminNavigation({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const initial = (name || email || "A").charAt(0).toUpperCase();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-20 items-center border-b border-sidebar-border px-5"><Link href="/admin" aria-label="ScopeSeal admin" className="text-sidebar-foreground"><SealLogo withWordmark size={23} /></Link></div>
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Admin navigation">
          <Link href="/app" className="mb-4 flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"><ArrowLeft className="size-4" />Back to app</Link>
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-md border-l-2 px-3 text-sm font-medium transition-colors", active ? "border-primary bg-sidebar-accent text-sidebar-foreground" : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground")}><item.icon className="size-4" />{item.label === "AI" ? "AI Configuration" : item.label}</Link>;
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{initial}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-sidebar-foreground">{name || "Admin"}</p><p className="truncate text-xs text-muted-foreground">{email}</p></div><ThemeToggle /></div>
          <SignOutButton className="w-full" />
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <Link href="/admin" aria-label="ScopeSeal admin"><SealLogo withWordmark size={21} /></Link>
        <div className="flex items-center gap-1"><ThemeToggle /><DropdownMenu><DropdownMenuTrigger asChild><button type="button" className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Open admin account menu">{initial}</button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 p-1.5"><DropdownMenuLabel className="px-2 py-2"><span className="block truncate text-sm text-foreground">{name || "Admin"}</span><span className="block truncate font-normal">{email}</span></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild className="min-h-10 px-2"><Link href="/app"><ArrowLeft />Back to app</Link></DropdownMenuItem><DropdownMenuItem className="min-h-10 px-2" onSelect={() => signOut({ callbackUrl: "/" })}><LogOut />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 md:hidden" aria-label="Admin navigation">
        {navItems.map((item) => { const active = isActive(pathname, item.href); return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}><item.icon className="size-[18px]" />{item.label}</Link>; })}
      </nav>
    </>
  );
}
