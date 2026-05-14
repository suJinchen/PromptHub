import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "violet" | "blue" | "pink" | "gray";
  className?: string;
};

const tones = {
  violet: "bg-[#f1ecff] text-violet-700",
  blue: "bg-blue-50 text-blue-700",
  pink: "bg-pink-50 text-pink-700",
  gray: "bg-gray-100 text-gray-600",
};

export function Badge({ children, tone = "violet", className = "" }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]} ${className}`}>{children}</span>;
}
