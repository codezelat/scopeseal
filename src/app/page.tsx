import { AiReviewSection } from "@/components/home/ai-review-section";
import { ExtensionCtaSection } from "@/components/home/extension-cta-section";
import { FeatureShowcase } from "@/components/home/feature-showcase";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { HomeHero } from "@/components/home/home-hero";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WorkflowSection } from "@/components/home/workflow-section";
import styles from "@/components/home/home-page.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
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
