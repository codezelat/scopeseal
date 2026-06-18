import { Metadata } from "next";
import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";
import { Mail, MessageCircle, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with ScopeSeal.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-2">
        <SealLogo size={28} withWordmark />
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">Support</h1>
      <p className="text-muted-foreground mb-8">
        We&apos;re here to help. Reach out and we&apos;ll get back to you.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <Mail className="h-6 w-6 text-seal-violet" />
          <h2 className="font-display text-lg font-semibold">Email us</h2>
          <p className="text-sm text-muted-foreground">
            For support, feature requests, or licensing inquiries.
          </p>
          <a
            href="mailto:info@codezela.com"
            className="text-sm text-seal-violet hover:underline"
          >
            info@codezela.com
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <MessageCircle className="h-6 w-6 text-seal-violet" />
          <h2 className="font-display text-lg font-semibold">FAQ</h2>
          <p className="text-sm text-muted-foreground">
            ScopeSeal does not provide legal advice. It&apos;s a clarity tool for
            agencies, freelancers, and delivery teams.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <Globe className="h-6 w-6 text-seal-violet" />
          <h2 className="font-display text-lg font-semibold">Chrome extension</h2>
          <p className="text-sm text-muted-foreground">
            Capture text from any page with one click. Your text stays local unless
            you choose to analyze it on the web app.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h2 className="font-display text-lg font-semibold">Publisher</h2>
          <p className="text-sm text-muted-foreground">
            ScopeSeal is a product of Codezela Technologies. © 2026 All rights
            reserved.
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link href="/" className="text-sm text-seal-violet hover:underline">
          ← Back to ScopeSeal
        </Link>
      </div>
    </main>
  );
}
