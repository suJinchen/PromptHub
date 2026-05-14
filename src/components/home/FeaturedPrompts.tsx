"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FAVORITE_CHANGE_EVENT, FavoriteButton, readFavorites } from "@/components/prompts/FavoriteButton";
import { PromptImage } from "@/components/prompts/PromptImage";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/format";
import type { PromptItem } from "@/types/prompt";

type FeaturedPromptsProps = { prompts: PromptItem[] };

function FeaturedCard({ prompt, index }: { prompt: PromptItem; index: number }) {
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
    <Link href={`/prompts/${prompt.slug}`} className="group relative min-h-[280px] overflow-hidden rounded-[22px] bg-zinc-900 shadow-[0_20px_54px_rgba(24,24,27,.12)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(24,24,27,.18)]">
      <PromptImage className="absolute inset-0 h-full w-full" src={prompt.coverImage} alt={prompt.title} fit="contain" sizes="(max-width: 768px) 100vw, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-black/12" />
      <div className="absolute left-4 top-4"><Badge className="bg-white/90 text-violet-700">{index === 0 ? "编辑推荐" : index === 1 ? "热门" : "最新"}</Badge></div>
      <FavoriteButton
        promptSlug={prompt.slug}
        className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full shadow-sm backdrop-blur transition"
        activeClassName="bg-white/90 text-rose-500"
        inactiveClassName="bg-white/20 text-white hover:bg-white/35"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="line-clamp-1 text-lg font-black">{prompt.title}</h3>
        <p className="mt-2 text-xs text-white/76">{prompt.category} · {prompt.tags.slice(0, 2).join(" · ")}</p>
        <p className="mt-4 text-xs text-white/82">♡ {formatNumber(favoriteCount)}　👁 {formatNumber(prompt.views)}</p>
      </div>
    </Link>
  );
}

export function FeaturedPrompts({ prompts }: FeaturedPromptsProps) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2"><span className="text-violet-600">✦</span><h2 className="text-xl font-black text-zinc-950 sm:text-2xl">精选提示词</h2></div>
        <Link href="/prompts" className="text-sm font-bold text-violet-600 hover:text-violet-500">查看全部 →</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {prompts.slice(0, 4).map((prompt, index) => <FeaturedCard key={prompt.id} prompt={prompt} index={index} />)}
      </div>
      <div className="mt-10 flex items-center justify-between rounded-2xl bg-[#f4efff] px-6 py-5 text-sm text-violet-700 shadow-sm"><span className="text-xl">“</span><p className="font-semibold">优秀的提示词，是通往惊艳视觉世界的钥匙。</p><span className="text-gray-500">— PromptHub 团队</span></div>
    </section>
  );
}
