"use client";

import Image from "next/image";
import { useState } from "react";

type PromptImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
};

export function PromptImage({ src, alt, className = "", priority = false, sizes = "(max-width: 768px) 100vw, 33vw", fit = "cover" }: PromptImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#f1ecff] via-white to-[#eef4ff] ${className}`} aria-label={alt}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(139,92,246,.18),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(216,180,254,.22),transparent_30%)]" />
        <div className="relative flex h-full min-h-36 items-center justify-center text-violet-400">
          <svg className="size-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16v10H4z" /><path d="m4 15 4-4 4 4 3-3 5 5" /><circle cx="15" cy="10" r="1.2" /></svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#fbf9ff] via-white to-[#f2f6ff] ${className}`}>
      {fit === "contain" ? (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-20 blur-xl"
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden="true"
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${fit === "contain" ? "object-contain p-2 transition duration-500 group-hover:scale-[1.02] md:p-3" : "object-cover transition duration-500 group-hover:scale-105"}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
