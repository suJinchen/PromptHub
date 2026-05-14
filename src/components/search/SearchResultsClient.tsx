"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LoadMoreButton } from "@/components/prompts/LoadMoreButton";
import { MasonryPromptGrid } from "@/components/prompts/MasonryPromptGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { searchPrompts } from "@/lib/search";
import type { CategoryItem } from "@/types/category";
import type { PromptItem, PromptSort } from "@/types/prompt";
import type { TagItem } from "@/types/tag";

const sortOptions: { label: string; value: PromptSort }[] = [{ label: "最新", value: "latest" }, { label: "热门", value: "popular" }, { label: "收藏最多", value: "favorites" }];
const suggestions = ["头像", "海报", "产品图", "国风插画", "3D 图标", "UI 设计"];

type SearchResultsClientProps = { prompts: PromptItem[]; categories: CategoryItem[]; tags: TagItem[]; initialQuery: string };

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"filter-pill " + (active ? "filter-pill-active" : "filter-pill-idle")}>{children}</button>;
}

export function SearchResultsClient({ prompts, categories, tags, initialQuery }: SearchResultsClientProps) {
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<PromptSort>(initialQuery ? "latest" : "popular");
  const results = useMemo(() => searchPrompts(prompts, { query: initialQuery, category, tag, sort }), [prompts, initialQuery, category, tag, sort]);

  return (
    <section className="space-y-5 md:space-y-7">
      <SearchBar defaultValue={initialQuery} placeholder="搜索提示词、主题或风格..." />
      <div className="filter-stack">
        <div className="filter-row"><span className="filter-label">分类</span><Pill active={category === "all"} onClick={() => setCategory("all")}>全部</Pill>{categories.slice(0, 7).map((item) => <Pill key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)}>{item.name}</Pill>)}</div>
        <div className="filter-row"><span className="filter-label">标签</span><Pill active={tag === "all"} onClick={() => setTag("all")}>全部</Pill>{tags.slice(0, 9).map((item) => <Pill key={item.slug} active={tag === item.name} onClick={() => setTag(item.name)}>{item.name}</Pill>)}</div>
        <div className="filter-row"><span className="filter-label">排序</span>{sortOptions.map((item) => <Pill key={item.value} active={sort === item.value} onClick={() => setSort(item.value)}>{item.label}</Pill>)}</div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-gray-500">共找到 <span className="font-black text-violet-600">{results.length}</span> 个相关提示词</p><Button href="/prompts" variant="secondary">返回提示词库</Button></div>
      {results.length > 0 ? <><MasonryPromptGrid prompts={results} /><LoadMoreButton /></> : <div className="space-y-5"><EmptyState title="没有找到相关提示词" description="换个关键词试试，或者浏览热门分类。" actionHref="/prompts" actionLabel="返回提示词库" /><div className="flex flex-wrap justify-center gap-2 sm:justify-start">{suggestions.map((item) => <Link className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-[#f8f5ff]" href={"/search?q=" + encodeURIComponent(item)} key={item}>{item}</Link>)}</div></div>}
    </section>
  );
}
