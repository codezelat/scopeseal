import { ThemeImage } from "./theme-image";
import { HomeMotionSection } from "./home-motion";
import styles from "./home-page.module.css";

const featureCards = [
  {
    title: "Clarity Score",
    description: "Measure how complete your project scope is.",
    className: styles.featureLarge,
    darkSrc: "/images/home/inbox-result-dark.webp",
    lightSrc: "/images/home/inbox-result-light.webp",
    imageClassName: styles.featureImageClarity,
  },
  {
    title: "Missing Item Detection",
    description: "Find missing timelines, payments, and deliverables.",
    className: styles.featureCompact,
    darkSrc: "/images/home/workflow-report-dark.webp",
    lightSrc: "/images/home/missing-items-light.webp",
    imageClassName: styles.featureImageMissing,
  },
  {
    title: "Risk Detection",
    description: "Detect vague wording that leads to revisions.",
    className: styles.featureCompact,
    darkSrc: "/images/home/workflow-report-dark.webp",
    lightSrc: "/images/home/risk-detection-light.webp",
    imageClassName: styles.featureImageRisk,
  },
  {
    title: "AI Suggestions",
    description: "Get recommendations to improve your brief.",
    className: styles.featureWide,
    darkSrc: "/images/home/report-page-dark.webp",
    lightSrc: "/images/home/recommendations-light.webp",
    imageClassName: styles.featureImageSuggestions,
  },
  {
    title: "Chrome Extension",
    description: "Analyze emails directly from your browser.",
    className: styles.featureWide,
    darkSrc: "/images/home/extension-dark.webp",
    lightSrc: "/images/home/extension-light.webp",
    imageClassName: styles.featureImageExtension,
  },
] as const;

export function FeatureShowcase() {
  return (
    <HomeMotionSection className={styles.section} id="features" aria-labelledby="features-heading">
      <div className={styles.sectionIntro}>
        <h2 id="features-heading">What&apos;s New In ScopeSeal</h2>
        <p>
          Built specifically for freelancers, agencies, and software teams to eliminate scope
          creep before work begins.
        </p>
      </div>
      <div className={styles.featureGrid}>
        {featureCards.map((feature) => (
          <article className={`${styles.featureCard} ${feature.className}`} key={feature.title}>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
            <ThemeImage
              className={feature.imageClassName}
              darkSrc={feature.darkSrc}
              lightSrc={feature.lightSrc}
              alt={`${feature.title} preview`}
            />
          </article>
        ))}
      </div>
    </HomeMotionSection>
  );
}
