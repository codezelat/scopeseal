import Link from "next/link";
import { HomeActionLink } from "./home-action-link";
import { HomeLogo } from "./home-logo";
import { HomeThemeToggle } from "./home-theme-toggle";
import { MobileMenu } from "@/components/site/mobile-menu";
import { primaryNavigation } from "@/components/site/public-navigation";
import styles from "./home-page.module.css";

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <HomeLogo />
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <HomeThemeToggle />
          <Link className={styles.headerSignIn} href="/signin">
            Sign in
          </Link>
          <HomeActionLink className={styles.primaryButton} href="/analyze">
            Analyze Brief
          </HomeActionLink>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
