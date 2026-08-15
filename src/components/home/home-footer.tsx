import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HomeLogo } from "./home-logo";
import styles from "./home-page.module.css";

const footerGroups = [
  {
    title: "PRODUCT",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Analyze", href: "/analyze" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/support" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <HomeLogo linked={false} />
          <p>Seal the gaps before they become unpaid work.</p>
        </div>
        <div className={styles.footerLinks}>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.socialLinks} aria-label="Social platforms" role="list">
        <span aria-label="Facebook" role="listitem"><FaFacebookF aria-hidden="true" /></span>
        <span aria-label="Instagram" role="listitem"><FaInstagram aria-hidden="true" /></span>
        <span aria-label="X" role="listitem"><FaXTwitter aria-hidden="true" /></span>
        <span aria-label="TikTok" role="listitem"><FaTiktok aria-hidden="true" /></span>
      </div>
      <div className={styles.footerBottom}>© 2026 Codezela Technologies. All rights reserved.</div>
    </footer>
  );
}
