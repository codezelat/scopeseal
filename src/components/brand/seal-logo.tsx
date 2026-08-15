import { cn } from "@/lib/utils";
import styles from "./seal-logo.module.css";

interface SealLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

function SealMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(styles.mark, className)}
      style={{ width: size, height: Math.round(size * 1.16) }}
      aria-hidden="true"
    />
  );
}

function SealLogo({ className, size = 28, withWordmark = false }: SealLogoProps) {
  if (!withWordmark) {
    return <SealMark size={size} className={className} />;
  }

  return (
    <span className={cn(styles.logo, className)}>
      <SealMark size={size} />
      <span style={{ fontSize: Math.max(15, Math.round(size * 0.72)) }}>
        ScopeSeal
      </span>
    </span>
  );
}

export { SealLogo, SealMark };
