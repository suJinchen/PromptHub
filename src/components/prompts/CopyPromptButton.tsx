"use client";

import { useState } from "react";

type CopyPromptButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: "secondary" | "primary";
};

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function CopyPromptButton({ text, label = "复制", copiedLabel = "已复制", className = "", variant = "secondary" }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
    } catch {
      fallbackCopy(text);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  const variantClass =
    variant === "primary"
      ? "border-violet-600 bg-violet-600 text-white shadow-[0_10px_26px_rgba(109,74,255,.18)] hover:border-violet-500 hover:bg-violet-500"
      : "border-violet-200 bg-white/95 text-violet-700 shadow-[0_6px_16px_rgba(109,74,255,.08)] hover:border-violet-300 hover:bg-[#f7f2ff]";

  return (
    <button
      className={`inline-flex min-h-8 items-center justify-center rounded-full border px-3.5 text-xs font-semibold transition hover:-translate-y-0.5 ${variantClass} ${copied ? (variant === "primary" ? "border-violet-500 bg-violet-500 text-white" : "border-violet-300 bg-[#f1ecff] text-violet-700") : ""} ${className}`}
      type="button"
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
