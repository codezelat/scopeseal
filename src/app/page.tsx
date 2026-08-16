import { AiReviewSection } from "@/components/home/ai-review-section";
import { ExtensionCtaSection } from "@/components/home/extension-cta-section";
import { FeatureShowcase } from "@/components/home/feature-showcase";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { HomeHero } from "@/components/home/home-hero";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WorkflowSection } from "@/components/home/workflow-section";
import styles from "@/components/home/home-page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ScopeSeal",
  url: "https://scopeseal.codezela.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Chrome",
  description:
    "A project scope clarity tool that finds missing details and risky wording in briefs and proposals.",
  publisher: {
    "@type": "Organization",
    name: "Codezela Technologies",
    url: "https://codezela.com/",
  },
};

export default function Home() {
  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
      />
      <HomeHeader />
      <main>
        <HomeHero />
        <FeatureShowcase />
        <WorkflowSection />
        <AiReviewSection />
        <TestimonialsSection />
        <ExtensionCtaSection />
      </main>
      <HomeFooter />
    </div>
  );
}
import type { Metadata } from "next";
