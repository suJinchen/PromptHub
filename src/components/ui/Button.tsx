import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const base = "inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";
const variants = {
  primary: "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_12px_26px_rgba(109,74,255,.22)] hover:shadow-[0_16px_36px_rgba(109,74,255,.28)]",
  secondary: "border border-[#e8e5f0] bg-white text-violet-700 shadow-sm hover:border-violet-200 hover:bg-[#fbf9ff]",
  ghost: "text-gray-600 hover:bg-[#f8f7fb] hover:text-violet-700",
};

export function Button({ href, children, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
