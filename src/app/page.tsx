import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorksSection } from "@/components/site/how-it-works-section";
import { ProjectTypesSection } from "@/components/site/project-types-section";
import { FeaturesSection } from "@/components/site/features-section";
import { ScoreDemoSection } from "@/components/site/score-demo-section";
import { ExtensionCtaSection } from "@/components/site/extension-cta-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ProjectTypesSection />
        <FeaturesSection />
        <ScoreDemoSection />
        <ExtensionCtaSection />
      </main>
      <Footer />
    </>
  );
}
