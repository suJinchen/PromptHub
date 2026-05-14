import type { ReactNode } from "react";

type DreamBackgroundProps = { children: ReactNode; className?: string; compact?: boolean };

export function DreamBackground({ children, className = "", compact = false }: DreamBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`aurora-field absolute inset-x-0 top-0 -z-10 ${compact ? "h-[360px]" : "h-[500px]"}`} />
      {children}
    </div>
  );
}
