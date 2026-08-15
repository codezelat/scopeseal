import Link from "next/link";
import { ThemeImage } from "./theme-image";
import styles from "./home-page.module.css";

export function ExtensionCtaSection() {
  return (
    <section className={styles.extensionSection} id="extension" aria-labelledby="extension-heading">
      <div className={styles.extensionCopy}>
        <h2 id="extension-heading">Check Briefs In One Click</h2>
        <p>
          The ScopeSeal Chrome extension lets you highlight any brief or client message and get an
          instant clarity score.
        </p>
        <Link className={styles.primaryButton} href="/support">
          Add To Chrome
        </Link>
      </div>
      <ThemeImage
        className={styles.extensionVisual}
        darkSrc="/images/home/extension-dark.png"
        lightSrc="/images/home/extension-light.png"
        alt="ScopeSeal Chrome extension analyzing a brief"
      />
    </section>
  );
}
