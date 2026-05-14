import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-[22px] border border-[#e8e5f0]/90 bg-white shadow-[0_18px_50px_rgba(24,24,27,.055)] ${className}`} {...props}>
      {children}
    </div>
  );
}
