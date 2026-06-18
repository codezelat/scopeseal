"use client";

import { useEffect, useId } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Band = "clear" | "review" | "risky";

interface SealScoreRingProps {
  score: number;
  band?: Band;
  size?: number;
  label?: string;
  duration?: number;
  className?: string;
}

function getBand(score: number): Band {
  if (score >= 70) return "clear";
  if (score >= 40) return "review";
  return "risky";
}

const bandColors: Record<Band, { text: string; stroke: string; bg: string; label: string }> = {
  clear: { text: "text-clear", stroke: "var(--clear)", bg: "bg-clear/15", label: "Clear" },
  review: { text: "text-risk", stroke: "var(--risk)", bg: "bg-risk/15", label: "Needs review" },
  risky: { text: "text-missing", stroke: "var(--missing)", bg: "bg-missing/15", label: "Risky" },
};

function AnimatedNumber({
  value,
  reduced,
}: {
  value: number;
  reduced: boolean;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (reduced) {
      motionVal.set(value);
      return;
    }
    const controls = animate(motionVal, value, { duration: 1.4, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduced, motionVal]);

  if (reduced) {
    return <span>{value}</span>;
  }

  return <motion.span>{rounded}</motion.span>;
}

export function SealScoreRing({
  score,
  band: bandProp,
  size = 160,
  label,
  duration = 1.4,
  className,
}: SealScoreRingProps) {
  const id = useId();
  const gradId = `seal-ring-${id}`;
  const reduced = useReducedMotion();

  const band = bandProp ?? getBand(score);
  const colors = bandColors[band];
  const bandLabel = label ?? colors.label;

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const finalOffset = circumference * (1 - score / 100);

  return (
    <div
      role="img"
      aria-label={`Scope clarity score ${score} out of 100, ${bandLabel.toLowerCase()}`}
      className={cn("relative inline-flex flex-col items-center", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--seal-violet)" />
            <stop offset="100%" stopColor="var(--seal-indigo)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduced ? { strokeDashoffset: finalOffset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: finalOffset }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration, ease: "easeOut", type: "spring", bounce: 0.15 }
          }
        />
      </svg>

      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={reduced ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.6, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.6, delay: duration * 0.3, type: "spring", bounce: 0.3 }
        }
      >
        <span
          className={cn(
            "font-mono text-4xl font-bold tabular-nums leading-none",
            colors.text
          )}
          style={{ fontSize: size * 0.22 }}
        >
          <AnimatedNumber value={score} reduced={!!reduced} />
          <span className="text-muted-foreground" style={{ fontSize: size * 0.11 }}>
            /100
          </span>
        </span>
      </motion.div>

      {/* Band pill */}
      <motion.div
        className={cn("mt-2 rounded-full px-3 py-0.5 text-xs font-medium", colors.bg, colors.text)}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { delay: duration * 0.6, duration: 0.3 }}
      >
        {bandLabel}
      </motion.div>
    </div>
  );
}
