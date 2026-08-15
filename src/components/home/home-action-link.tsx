"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { SealLoader } from "@/components/brand/seal-loader";
import styles from "./home-page.module.css";

type HomeActionLinkProps = {
  children: ReactNode;
  className: string;
  href: string;
};

export function HomeActionLink({ children, className, href }: HomeActionLinkProps) {
  const [pending, setPending] = useState(false);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button === 0 &&
      !event.defaultPrevented &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      setPending(true);
    }
  }

  return (
    <Link
      className={`${className} ${styles.actionLink}`}
      href={href}
      aria-busy={pending}
      data-pending={pending || undefined}
      onClick={handleClick}
    >
      <span className={styles.actionLinkLabel}>{children}</span>
      {pending ? (
        <span className={styles.actionLinkLoader} aria-hidden="true">
          <SealLoader size={18} />
        </span>
      ) : null}
    </Link>
  );
}
