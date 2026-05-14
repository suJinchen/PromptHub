"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FAVORITE_CHANGE_EVENT, FavoriteButton, readFavorites } from "@/components/prompts/FavoriteButton";
import { PromptImage } from "@/components/prompts/PromptImage";
import { formatNumber } from "@/lib/format";
import type { PromptItem } from "@/types/prompt";

type MasonryPromptCardProps = { prompt: PromptItem };

function EyeIcon() {
  return (
    <svg className="size-3.5 max-md:size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="size-3.5 max-md:size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function visibleTags(tags: string[] = [], max: number) {
  const shown = tags.slice(0, max);
  const rest = Math.max(tags.length - max, 0);
  return { shown, rest };
}

export function MasonryPromptCard({ prompt }: MasonryPromptCardProps) {
  const desktopTags = visibleTags(prompt.tags, 3);
  const mobileTags = visibleTags(prompt.tags, 2);
  const baseFavorites = prompt.favorites ?? prompt.likes ?? 0;
  const [favoriteCount, setFavoriteCount] = useState(baseFavorites);

  useEffect(() => {
    const syncFromStorage = () => setFavoriteCount(Math.max(0, baseFavorites + (readFavorites().has(prompt.slug) ? 1 : 0)));
    syncFromStorage();

    function handleFavoriteChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; active: boolean }>).detail;
      if (detail?.slug === prompt.slug) syncFromStorage();
    }

    window.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [baseFavorites, prompt.slug]);

  return (
    <article className="prompt-masonry-item">
      <div className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-[#e8e5f0]/80 bg-white p-2 shadow-[0_8px_22px_rgba(24,24,27,.035)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_16px_38px_rgba(109,74,255,.09)] md:rounded-[22px] md:p-3">
        <Link className="flex h-full min-w-0 flex-col" href={`/prompts/${prompt.slug}`}>
          <div className="relative">
            <PromptImage
              className="prompt-card-image rounded-[14px] md:rounded-[18px]"
              src={prompt.coverImage}
              alt={prompt.title}
              fit="contain"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
            <span className="absolute left-2 top-2 max-w-[72%] truncate rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-bold text-violet-700 shadow-sm backdrop-blur md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-xs">
              {prompt.category}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col pt-2 md:p-2 md:pt-3">
            <h3 className="line-clamp-2 min-h-[34px] text-[13px] font-bold leading-snug text-zinc-950 transition group-hover:text-violet-700 md:min-h-[42px] md:text-[15px] md:leading-[1.4]">
              {prompt.title}
            </h3>
            <p className="mt-1.5 hidden text-xs leading-5 text-gray-500 md:line-clamp-1 md:block md:min-h-5">{prompt.description}</p>

            <div className="mt-2 flex min-h-5 flex-wrap gap-1 md:hidden">
              {mobileTags.shown.map((tag) => (
                <span key={tag} className="max-w-[70px] truncate rounded-full bg-[#f6f2ff] px-2 py-0.5 text-[10px] font-bold text-violet-700">
                  {tag}
                </span>
              ))}
              {mobileTags.rest > 0 ? <span className="rounded-full bg-[#f6f2ff] px-2 py-0.5 text-[10px] font-bold text-violet-700">+{mobileTags.rest}</span> : null}
            </div>

            <div className="mt-2 hidden h-6 flex-nowrap gap-1.5 overflow-hidden md:flex">
              {desktopTags.shown.map((tag) => (
                <span key={tag} className="max-w-[86px] truncate rounded-full bg-[#f6f2ff] px-2.5 py-1 text-[11px] font-bold text-violet-700">
                  {tag}
                </span>
              ))}
              {desktopTags.rest > 0 ? <span className="rounded-full bg-[#f6f2ff] px-2.5 py-1 text-[11px] font-bold text-violet-700">+{desktopTags.rest}</span> : null}
            </div>

            <div className="mt-auto flex items-center gap-2 pt-2 text-[10px] font-semibold text-gray-500 md:gap-3 md:pt-3 md:text-xs">
              <span className="inline-flex shrink-0 items-center gap-0.5 md:gap-1"><EyeIcon />{formatNumber(prompt.views)}</span>
              <span className="inline-flex shrink-0 items-center gap-0.5 md:gap-1"><HeartIcon />{formatNumber(favoriteCount)}</span>
            </div>
          </div>
        </Link>

        <FavoriteButton
          promptSlug={prompt.slug}
          className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full shadow-sm backdrop-blur transition md:right-5 md:top-5 md:size-9"
        />
      </div>
    </article>
  );
}
