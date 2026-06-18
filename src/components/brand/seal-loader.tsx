"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SealLoaderProps {
  size?: number;
  className?: string;
}

export function SealLoader({ size = 40, className }: SealLoaderProps) {
  const reduced = useReducedMotion();
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const dashLen = circumference * 0.18;
  const gapLen = circumference * 0.07;

  return (
    <div role="status" aria-label="Loading" className={cn("inline-flex", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="seal-loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--seal-violet)" />
            <stop offset="100%" stopColor="var(--seal-indigo)" />
          </linearGradient>
        </defs>
        {/* Track ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Rotating dashes */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#seal-loader-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dashLen} ${gapLen} ${dashLen * 0.6} ${gapLen}`}
          animate={reduced ? {} : { rotate: 360 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1.2, repeat: Infinity, ease: "linear" }
          }
          style={{ transformOrigin: "center" }}
        />
        {/* N/S/E/W ticks */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const inner = radius - strokeWidth;
          const outer = radius + strokeWidth * 0.5;
          return (
            <line
              key={angle}
              x1={center + Math.cos(rad) * inner}
              y1={center + Math.sin(rad) * inner}
              x2={center + Math.cos(rad) * outer}
              y2={center + Math.sin(rad) * outer}
              stroke="var(--seal-violet)"
              strokeWidth={strokeWidth * 0.6}
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}
