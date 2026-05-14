import type { Metadata } from "next";
﻿import { PromptLibraryClient } from "@/components/prompts/PromptLibraryClient";
import { getAllCategories } from "@/lib/categories";
import { getAllPrompts } from "@/lib/prompts";
import { getAllTags } from "@/lib/tags";


export const metadata: Metadata = {
  title: "提示词库 - PromptHub",
  description: "浏览全部 GPT Image 2 提示词案例，按分类、标签和关键词快速筛选。",
};
export default function PromptsPage() {
  const prompts = getAllPrompts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <section className="page-shell">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">提示词库</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">浏览全部 GPT Image 2 提示词案例，按分类、标签和关键词快速筛选。</p>
      </div>
      <PromptLibraryClient prompts={prompts} categories={categories} tags={tags} />
    </section>
  );
}
