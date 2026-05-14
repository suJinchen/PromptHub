"use client";

import { useMemo, useState } from "react";
import { LoadMoreButton } from "@/components/prompts/LoadMoreButton";
import { MasonryPromptGrid } from "@/components/prompts/MasonryPromptGrid";
import { searchPrompts } from "@/lib/search";
import type { CategoryItem } from "@/types/category";
import type { PromptItem, PromptSort } from "@/types/prompt";
import type { TagItem } from "@/types/tag";

type PromptLibraryClientProps = { prompts: PromptItem[]; categories: CategoryItem[]; tags: TagItem[] };
const sortOptions: { label: string; value: PromptSort }[] = [{ label: "最新", value: "latest" }, { label: "热门", value: "popular" }, { label: "收藏最多", value: "favorites" }];
const featuredCategorySlugs = ["all", "portrait", "product-poster", "ecommerce-main-image", "chinese-illustration", "3d-icons", "ui-design", "game-concept-art"];

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"filter-pill " + (active ? "filter-pill-active" : "filter-pill-idle")}>{children}</button>;
}

export function PromptLibraryClient({ prompts, categories, tags }: PromptLibraryClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<PromptSort>("latest");
  const results = useMemo(() => searchPrompts(prompts, { query, category, tag, sort }), [prompts, query, category, tag, sort]);
  const categoryTabs = featuredCategorySlugs.map((slug) => slug === "all" ? { slug: "all", name: "全部" } : categories.find((item) => item.slug === slug)).filter(Boolean) as Array<{ slug: string; name: string }>;

  return (
    <section className="space-y-5 md:space-y-7">
      <form className="flex w-full items-center gap-1.5 rounded-full border border-[#e8e5f0] bg-white p-1.5 shadow-[0_12px_30px_rgba(24,24,27,.055)] md:gap-2 md:p-2" onSubmit={(event) => event.preventDefault()}>
        <span className="grid size-8 shrink-0 place-items-center text-gray-500 md:size-9"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="7" /></svg></span>
        <input className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索提示词、主题或风格..." />
        <button type="submit" className="shrink-0 rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white md:px-6">搜索</button>
      </form>

      <div className="filter-stack">
        <div className="filter-row"><span className="filter-label">分类</span>{categoryTabs.map((item) => <Pill key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)}>{item.name}</Pill>)}</div>
        <div className="filter-row"><span className="filter-label">标签</span><Pill active={tag === "all"} onClick={() => setTag("all")}>全部</Pill>{tags.slice(0, 10).map((item) => <Pill key={item.slug} active={tag === item.name} onClick={() => setTag(item.name)}>{item.name}</Pill>)}</div>
        <div className="filter-row"><span className="filter-label">排序</span>{sortOptions.map((item) => <Pill key={item.value} active={sort === item.value} onClick={() => setSort(item.value)}>{item.label}</Pill>)}</div>
      </div>

      <MasonryPromptGrid prompts={results} />
      {results.length > 0 ? <LoadMoreButton /> : null}
    </section>
  );
}
