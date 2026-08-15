import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { HomeActionLink } from "./home-action-link";
import { ThemeImage } from "./theme-image";
import styles from "./home-page.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroGrid} aria-hidden="true">
        <Image
          className={styles.heroGridImage}
          src="/images/home/grid-dark.png"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 800px) 1px, 100vw"
        />
      </div>
      <div className={styles.heroInner}>
        <Image
          className={styles.heroMascot}
          src="/images/home/mascot-hero.png"
          alt="ScopeSeal shield mascot holding a checklist and scope lens"
          width={235}
          height={266}
          priority
          sizes="(max-width: 800px) 150px, (max-width: 1024px) 170px, 235px"
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
            <HomeActionLink className={styles.primaryButton} href="/analyze">
              Analyze Brief
            </HomeActionLink>
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
          darkSrc="/images/home/inbox-result-dark-hd.webp"
          lightSrc="/images/home/inbox-result-light-hd.webp"
          alt="ScopeSeal reviewing a project inquiry and showing a clarity score of 27"
        />
      </div>
    </section>
  );
}
