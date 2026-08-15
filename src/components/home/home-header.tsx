import Link from "next/link";
import { HomeLogo } from "./home-logo";
import { HomeThemeToggle } from "./home-theme-toggle";
import styles from "./home-page.module.css";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <HomeLogo />
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <HomeThemeToggle />
          <Link className={styles.primaryButton} href="/analyze">
            Analyze Brief
          </Link>
        </div>
      </div>
    </header>
  );
}
