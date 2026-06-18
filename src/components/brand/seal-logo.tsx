import { cn } from "@/lib/utils";

interface SealLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

function SealMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="seal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#seal-grad)" />
      {/* Reticle ring */}
      <circle
        cx="14"
        cy="14"
        r="8.5"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      />
      {/* N tick */}
      <line x1="14" y1="4" x2="14" y2="6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* S tick */}
      <line x1="14" y1="21.5" x2="14" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* W tick */}
      <line x1="4" y1="14" x2="6.5" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* E tick */}
      <line x1="21.5" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill="white" />
    </svg>
  );
}

function SealLogo({ className, size = 28, withWordmark = false }: SealLogoProps) {
  if (!withWordmark) {
    return <SealMark size={size} className={className} />;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SealMark size={size} />
      <span className="font-display text-lg font-bold tracking-tight">
        <span>Scope</span>
        <span className="text-seal-gradient">Seal</span>
      </span>
    </div>
  );
}

export { SealLogo, SealMark };
