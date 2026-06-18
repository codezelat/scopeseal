"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, animate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 1.2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = String(value);
      return;
    }
    const controls = animate(motionVal, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, duration, reduced, motionVal]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {reduced ? value : 0}
    </span>
  );
}
