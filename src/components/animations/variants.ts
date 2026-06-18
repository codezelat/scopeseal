import type { Variants } from "motion/react";

export function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function reducedOr<V>(variants: V, fallback: V): V {
  return prefersReduced() ? fallback : variants;
}

const noOp = { opacity: 1, y: 0, scale: 1, x: 0, rotate: 0 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeUpReduced: Variants = {
  hidden: noOp,
  visible: noOp,
};

export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const staggerItemReduced: Variants = {
  hidden: noOp,
  visible: noOp,
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const scaleInReduced: Variants = {
  hidden: noOp,
  visible: noOp,
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const slideInReduced: Variants = {
  hidden: noOp,
  visible: noOp,
};

export function useReveal(): { variants: Variants } {
  const reduced = prefersReduced();
  return { variants: reduced ? fadeUpReduced : fadeUp };
}
