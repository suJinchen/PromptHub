"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import type { PromptItem } from "@/types/prompt";
import { HeroVisual } from "./HeroVisual";

type HeroSectionProps = { prompts: PromptItem[] };

const hotSearches = ["摄影", "极简主义", "赛博朋克", "水彩", "产品设计"];

export function HeroSection({ prompts }: HeroSectionProps) {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-white">
      <HeroVisual prompts={prompts} />
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1280px] items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-wide text-violet-600">发现 · 收藏 · 创造</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-zinc-950 sm:text-5xl lg:text-[58px]">
            发现最有价值的
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">GPT Image 2</span> 提示词
          </h1>
          <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">精选高质量提示词，激发灵感，创造惊艳的视觉作品。</p>
          <div className="mt-8 max-w-xl"><SearchBar placeholder="搜索提示词、主题或风格..." /></div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>热门搜索：</span>
            {hotSearches.map((item) => (
              <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="rounded-full bg-white/88 px-3 py-1.5 font-semibold text-gray-600 shadow-sm ring-1 ring-[#eeeaf5] transition hover:text-violet-700">
                {item}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/prompts" className="bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] text-white shadow-[0_14px_34px_rgba(109,40,217,.24)] hover:shadow-[0_18px_42px_rgba(109,40,217,.3)]">浏览提示词库</Button>
            <Button href="/categories" variant="secondary">查看热门分类</Button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-28 right-[11%] z-20 hidden rounded-2xl border border-white/80 bg-white/88 px-5 py-4 text-sm font-bold text-zinc-900 shadow-[0_18px_45px_rgba(24,24,27,.12)] backdrop-blur lg:block">
        <span className="mr-2">🔥</span> 今日热门
        <br />
        <span className="text-xs font-semibold text-gray-500">极简建筑光影</span>
      </div>
    </section>
  );
}
