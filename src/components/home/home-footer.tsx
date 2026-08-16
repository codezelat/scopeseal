import Link from "next/link";
import { Heart } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  chromeExtensionUrl,
  codezelaSocials,
  codezelaUrl,
} from "@/components/site/public-navigation";
import { HomeLogo } from "./home-logo";
import styles from "./home-page.module.css";

const footerGroups = [
  {
    title: "PRODUCT",
    links: [
      { label: "Analyze Brief", href: "/analyze" },
      { label: "Features", href: "/features" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Chrome Extension", href: chromeExtensionUrl, external: true },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { label: "Dashboard", href: "/app" },
      { label: "Saved Reviews", href: "/app/reviews" },
      { label: "Templates", href: "/app/templates" },
      { label: "Settings", href: "/app/settings" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "Sign in", href: "/signin" },
      { label: "Create account", href: "/signup" },
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/contact" },
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

const socialIcons = {
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  X: FaXTwitter,
  YouTube: FaYoutube,
  TikTok: FaTiktok,
} as const;

export function HomeFooter() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <HomeLogo linked={false} />
          <p>Seal the gaps before they become unpaid work.</p>
          <div className={styles.footerSocials} aria-label="Codezela Technologies on social media">
            {codezelaSocials.map((social) => {
              const Icon = socialIcons[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label}, Codezela Technologies (opens in a new tab)`}
                  title={social.label}
                >
                  <Icon aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
        <div className={styles.footerLinks}>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                "external" in link && link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 ScopeSeal. All rights reserved.</span>
        <span className={styles.builtBy}>
          Built with <Heart aria-hidden="true" /> by
          <a href={codezelaUrl} target="_blank" rel="noopener noreferrer">
            Codezela Technologies
          </a>
        </span>
      </div>
    </footer>
  );
}
