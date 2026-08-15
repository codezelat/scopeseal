import { ThemeImage } from "./theme-image";
import { HomeMotionSection } from "./home-motion";
import styles from "./home-page.module.css";

const reviewPoints = [
  "Missing deliverables",
  "Timeline gaps",
  "Payment terms",
  "Revision limits",
] as const;

export function AiReviewSection() {
  return (
    <HomeMotionSection className={styles.aiReviewSection} aria-labelledby="ai-review-heading">
      <div className={styles.aiReviewCopy}>
        <h2 id="ai-review-heading">Let AI Review Every Brief For You</h2>
        <p>ScopeSeal analyzes every project brief and highlights unclear requirements.</p>
        <ul>
          {reviewPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <div className={styles.aiReviewVisual} aria-label="ScopeSeal analyzing an email brief">
        <ThemeImage
          className={styles.aiReviewBack}
          darkSrc="/images/home/inbox-extension-dark.webp"
          lightSrc="/images/home/inbox-extension-light.webp"
          alt="ScopeSeal browser extension ready to analyze a brief"
        />
        <ThemeImage
          className={styles.aiReviewFront}
          darkSrc="/images/home/inbox-result-dark.webp"
          lightSrc="/images/home/inbox-result-light.webp"
          alt="ScopeSeal clarity report over the reviewed brief"
        />
      </div>
    </HomeMotionSection>
  );
}
