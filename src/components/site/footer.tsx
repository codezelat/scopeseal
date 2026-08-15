import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Analyze", href: "/analyze" },
];

const companyLinks = [
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/support" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <SealLogo withWordmark size={24} />
            <p className="max-w-xs text-sm text-muted-foreground">
              Seal the gaps before they become unpaid work.
            </p>
          </div>

          {/* Product */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Product</h2>
            <ul className="flex flex-col gap-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Company</h2>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Legal</h2>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Codezela Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
