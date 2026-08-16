import { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ScopeSeal by Codezela handles your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (<><Header /><main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 border-b border-border pb-8 text-sm text-muted-foreground">Last updated: June 2026 · Codezela Technologies</p>
      <div className="space-y-9 py-10 text-[15px] leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight [&_li]:pl-1 [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground">
        <h2 className="text-foreground">1. Overview</h2>
        <p>
          ScopeSeal is a project scope clarity tool. It reviews text that you
          provide, including project briefs, client messages, and proposal sections, to
          highlight missing details and risky wording. We are committed to
          protecting your privacy and minimizing data collection.
        </p>

        <h2 className="text-foreground">2. What data we process</h2>
        <p>
          <strong className="text-foreground">Text you submit:</strong> When you
          paste or capture text for analysis, the text is processed to generate a
          clarity report. If you have an account, the report is saved to your
          account. If you are a guest, the result is returned to your browser but
          not permanently stored unless you create an account.
        </p>
        <p>
          <strong className="text-foreground">Account data:</strong> If you create
          an account, we store your email address and a hashed password. We do not
          store passwords in plain text.
        </p>
        <p>
          <strong className="text-foreground">Analytics:</strong> We do not use
          third-party analytics trackers in V1.
        </p>

        <h2 className="text-foreground">3. Chrome extension</h2>
        <p>
          The ScopeSeal Chrome extension captures selected text or page text{" "}
          <strong className="text-foreground">only after you take an explicit
          action</strong>: clicking the extension icon or using the right-click
          context menu. The extension does <strong className="text-foreground">
          not</strong> automatically read, scan, or upload any page content. Text
          is sent to the ScopeSeal web app only when you click &quot;Open in
          ScopeSeal&quot; or &quot;Analyze on web.&quot;
        </p>
        <p>
          The extension requests the following permissions:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-foreground">activeTab</strong>: to access the current tab&apos;s text only when you click.</li>
          <li><strong className="text-foreground">scripting</strong>: to capture page text on demand.</li>
          <li><strong className="text-foreground">contextMenus</strong>: to show &quot;Analyze with ScopeSeal&quot; on right-click.</li>
          <li><strong className="text-foreground">storage</strong>: to save your preferences locally.</li>
        </ul>
        <p>
          The extension does <strong className="text-foreground">not</strong>{" "}
          request access to all websites, does not run on every page, and does not
          use background monitoring.
        </p>

        <h2 className="text-foreground">4. Shared reports</h2>
        <p>
          If you enable a private share link, the report is accessible via an
          unguessable URL. Shared reports are marked <code>noindex</code> and are
          not included in search engine results. You can delete a report or revoke
          sharing at any time.
        </p>

        <h2 className="text-foreground">5. AI enhancement (optional)</h2>
        <p>
          If an administrator enables the optional AI enhancement mode, text you
          submit may be sent to an OpenAI-compatible API provider for enhanced
          analysis. This feature is off by default. When enabled, the provider and
          data-processing terms apply. AI is used only to enhance suggestions, not
          to replace the deterministic checker or to train models.
        </p>

        <h2 className="text-foreground">6. Data retention</h2>
        <p>
          You can delete any saved report at any time. Account deletion removes all
          associated reports. We do not retain client brief text longer than
          necessary for the service.
        </p>

        <h2 className="text-foreground">7. Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your data by
          contacting <a href="mailto:info@codezela.com" className="text-seal-violet hover:underline">info@codezela.com</a>.
        </p>

        <h2 className="text-foreground">8. Not legal advice</h2>
        <p>
          ScopeSeal is a clarity and delivery-risk tool. It does not provide legal
          advice. No attorney-client relationship is created by using ScopeSeal.
        </p>

        <h2 className="text-foreground">9. Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:info@codezela.com" className="text-seal-violet hover:underline">info@codezela.com</a>.
        </p>
      </div>

    </main><Footer /></>);
}
