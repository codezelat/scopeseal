import Link from "next/link";
import styles from "./home-page.module.css";

type HomeLogoProps = {
  linked?: boolean;
};

function LogoContent() {
  return (
    <>
      <span className={styles.logoMark} aria-hidden="true">
        <span />
      </span>
      <span>ScopeSeal</span>
    </>
  );
}

export function HomeLogo({ linked = true }: HomeLogoProps) {
  if (!linked) {
    return (
      <span className={styles.logo}>
        <LogoContent />
      </span>
    );
  }

  return (
    <Link className={styles.logo} href="/" aria-label="ScopeSeal home">
      <LogoContent />
    </Link>
  );
}
