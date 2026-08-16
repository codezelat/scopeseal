import { FaChrome } from "react-icons/fa6";
import { chromeExtensionUrl } from "@/components/site/public-navigation";
import { HomeMotionSection } from "./home-motion";
import { ThemeImage } from "./theme-image";
import styles from "./home-page.module.css";

export function ExtensionCtaSection() {
  return (
    <HomeMotionSection className={styles.extensionSection} id="extension" aria-labelledby="extension-heading">
      <div className={styles.extensionCopy}>
        <h2 id="extension-heading">Check Briefs In One Click</h2>
        <p>
          The ScopeSeal Chrome extension lets you highlight any brief or client message and get an
          instant clarity score.
        </p>
        <a
          className={styles.primaryButton}
          href={chromeExtensionUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaChrome aria-hidden="true" />
          Add To Chrome
        </a>
      </div>
      <ThemeImage
        className={styles.extensionVisual}
        darkSrc="/images/home/extension-realistic.webp"
        lightSrc="/images/home/extension-realistic-light.webp"
        alt="ScopeSeal Chrome extension open in Chrome and ready to analyze a selected brief"
      />
    </HomeMotionSection>
  );
}
