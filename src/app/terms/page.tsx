import { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using ScopeSeal by Codezela.",
};

export default function TermsPage() {
  return (<><Header /><main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-3 border-b border-border pb-8 text-sm text-muted-foreground">Last updated: June 2026 · Codezela Technologies</p>
      <div className="space-y-9 py-10 text-[15px] leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight [&_li]:pl-1 [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground">
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

    </main><Footer /></>);
}
