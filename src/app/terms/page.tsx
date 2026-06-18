import { Metadata } from "next";
import Link from "next/link";
import { SealLogo } from "@/components/brand/seal-logo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using ScopeSeal by Codezela.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-2">
        <SealLogo size={28} withWordmark />
      </Link>
      <h1 className="font-display text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: June 2026 · Codezela Technologies
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-foreground">1. Acceptance of terms</h2>
        <p>
          By using ScopeSeal (&quot;the Service&quot;), you agree to these terms.
          If you do not agree, do not use the Service.
        </p>

        <h2 className="text-foreground">2. Description of service</h2>
        <p>
          ScopeSeal is a project scope clarity tool that analyzes text you provide
          and highlights missing details, vague wording, and scope-creep risks. It
          is available as a web application and a Chrome extension.
        </p>

        <h2 className="text-foreground">3. No legal advice</h2>
        <p>
          ScopeSeal is a clarity and delivery-risk tool. It does{" "}
          <strong className="text-foreground">not</strong> provide legal advice,
          legal review, or any form of legal opinion. No attorney-client
          relationship is created by using the Service. You should consult a
          qualified attorney for legal matters.
        </p>

        <h2 className="text-foreground">4. Your content</h2>
        <p>
          You retain ownership of the text you submit. You are responsible for
          ensuring you have the right to submit any text for analysis. Do not
          submit confidential or sensitive personal information (such as credit
          card numbers or government IDs) unless absolutely necessary.
        </p>

        <h2 className="text-foreground">5. Acceptable use</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Do not abuse, overload, or attempt to disrupt the Service.</li>
          <li>Do not use automated tools to scrape or mass-submit content.</li>
          <li>Respect rate limits for guest analysis.</li>
        </ul>

        <h2 className="text-foreground">6. Limitation of liability</h2>
        <p>
          ScopeSeal is provided &quot;as is&quot; without warranties of any kind.
          Codezela Technologies is not liable for any damages arising from the use
          of or inability to use the Service, including but not limited to lost
          revenue, client disputes, or business decisions based on analysis
          results.
        </p>

        <h2 className="text-foreground">7. Changes to terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          Service after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-foreground">8. Contact</h2>
        <p>
          Questions? Email{" "}
          <a href="mailto:info@codezela.com" className="text-seal-violet hover:underline">info@codezela.com</a>.
        </p>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link href="/" className="text-sm text-seal-violet hover:underline">
          ← Back to ScopeSeal
        </Link>
      </div>
    </main>
  );
}
