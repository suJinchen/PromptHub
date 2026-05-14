import type { Metadata } from "next";
﻿import { SearchResultsClient } from "@/components/search/SearchResultsClient";
import { getAllCategories } from "@/lib/categories";
import { getAllPrompts } from "@/lib/prompts";
import { getAllTags } from "@/lib/tags";


export const metadata: Metadata = {
  title: "搜索 - PromptHub",
  description: "搜索 PromptHub 中的 GPT Image 2 提示词案例，支持关键词、分类和标签筛选。",
};
type SearchPageProps = { searchParams?: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.trim() : "";

  return (
    <section className="page-shell">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{query ? `搜索结果：“${query}”` : "搜索提示词"}</h1>
        <p className="mt-3 text-base leading-7 text-gray-600">{query ? "根据关键词匹配标题、分类、标签、提示词内容和适用场景。" : "输入关键词，或先浏览当前热门提示词。"}</p>
      </div>
      <SearchResultsClient prompts={getAllPrompts()} categories={getAllCategories()} tags={getAllTags()} initialQuery={query} />
    </section>
  );
}
