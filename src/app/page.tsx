import type { Metadata } from "next";
﻿import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";
import { HeroSection } from "@/components/home/HeroSection";
import { getAllCategories } from "@/lib/categories";
import { getFeaturedPrompts } from "@/lib/prompts";


export const metadata: Metadata = {
  title: "PromptHub - GPT Image 2 提示词灵感库",
  description: "收集高质量 GPT Image 2 图片案例、中文提示词、英文提示词与创作思路，帮助创作者快速搜索、浏览和复制 AI 图片提示词。",
};
export default function Home() {
  const categories = getAllCategories();
  const featuredPrompts = getFeaturedPrompts(8);

  return (
    <>
      <HeroSection prompts={featuredPrompts} />
      <CategoryStrip categories={categories} />
      <FeaturedPrompts prompts={featuredPrompts.slice(0, 6)} />
    </>
  );
}
