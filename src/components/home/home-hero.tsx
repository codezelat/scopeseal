import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ThemeImage } from "./theme-image";
import styles from "./home-page.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroInner}>
        <Image
          className={styles.heroMascot}
          src="/images/home/mascot-hero.png"
          alt="ScopeSeal shield mascot holding a checklist and scope lens"
          width={235}
          height={266}
          priority
          sizes="(max-width: 767px) 150px, 235px"
        />
        <div className={styles.heroCopy}>
          <h1 id="home-heading">
            Seal The Gaps
            <span>Before They Become Unpaid Work</span>
          </h1>
          <p>
            ScopeSeal reviews project briefs, client messages, and proposals to find missing
            details, vague wording, and scope-creep risks in seconds.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/analyze">
              Analyze Brief
            </Link>
            <a className={styles.secondaryButton} href="#extension">
              Add To Chrome
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.heroPreviewWrap}>
        <ThemeImage
          className={styles.heroPreview}
          darkSrc="/images/home/inbox-result-dark.png"
          lightSrc="/images/home/inbox-result-light.png"
          alt="ScopeSeal reviewing a project inquiry and showing a clarity score of 27"
        />
      </div>
    </section>
  );
}
