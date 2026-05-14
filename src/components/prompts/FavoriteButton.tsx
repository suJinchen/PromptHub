"use client";

import { useEffect, useState } from "react";

type FavoriteButtonProps = {
  promptSlug: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  label?: string;
  onToggle?: (active: boolean) => void;
};

const STORAGE_KEY = "prompthub:favorites";
export const FAVORITE_CHANGE_EVENT = "prompthub:favorite-change";

export function readFavorites() {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const values = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(values);
  } catch {
    return new Set<string>();
  }
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

export function FavoriteButton({
  promptSlug,
  className = "",
  activeClassName = "bg-[#fff1f7] text-rose-500",
  inactiveClassName = "bg-white/90 text-violet-500 hover:bg-[#f6f2ff]",
  label = "收藏",
  onToggle,
}: FavoriteButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => setActive(readFavorites().has(promptSlug));
    const timer = window.setTimeout(syncFromStorage, 0);

    function handleFavoriteChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; active: boolean }>).detail;
      if (detail?.slug === promptSlug) setActive(detail.active);
    }

    window.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [promptSlug]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const favorites = readFavorites();
    const nextActive = !favorites.has(promptSlug);

    if (nextActive) {
      favorites.add(promptSlug);
    } else {
      favorites.delete(promptSlug);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
    setActive(nextActive);
    onToggle?.(nextActive);
    window.dispatchEvent(new CustomEvent(FAVORITE_CHANGE_EVENT, { detail: { slug: promptSlug, active: nextActive } }));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className} ${active ? activeClassName : inactiveClassName}`}
      aria-label={active ? "取消收藏" : label}
      aria-pressed={active}
    >
      <HeartIcon active={active} />
    </button>
  );
}
