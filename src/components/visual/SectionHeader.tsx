import type { ReactNode } from "react";

type SectionHeaderProps = { eyebrow?: string; title: ReactNode; description?: string; align?: "left" | "center"; className?: string };

export function SectionHeader({ eyebrow, title, description, align = "left", className = "" }: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? <p className="text-sm font-bold text-violet-600">{eyebrow}</p> : null}
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}
