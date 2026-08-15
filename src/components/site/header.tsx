import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Testimonials", href: "/#testimonials" },
] as const;

export function Header() {
  return (
    <header className="relative z-40 border-b border-border bg-background">
      <div className="mx-auto grid min-h-20 max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="w-fit text-foreground"
          aria-label="ScopeSeal home"
        >
          <SealLogo withWordmark size={25} />
        </Link>

        <nav
          className="hidden items-center gap-9 text-sm text-muted-foreground md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/analyze">Analyze Brief</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
