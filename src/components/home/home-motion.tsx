"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type HomeMotionSectionProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  delay?: number;
};

export function HomeMotionSection({
  children,
  delay = 0,
  ...props
}: HomeMotionSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      {...props}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
