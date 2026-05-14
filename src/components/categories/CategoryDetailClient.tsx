"use client";

import { useMemo, useState } from "react";
import { LoadMoreButton } from "@/components/prompts/LoadMoreButton";
import { MasonryPromptGrid } from "@/components/prompts/MasonryPromptGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchPrompts } from "@/lib/search";
import type { CategoryItem } from "@/types/category";
import type { PromptItem, PromptSort } from "@/types/prompt";

const sortOptions: { label: string; value: PromptSort }[] = [{ label: "最新", value: "latest" }, { label: "热门", value: "popular" }, { label: "收藏最多", value: "favorites" }];

type CategoryDetailClientProps = { category: CategoryItem; prompts: PromptItem[] };

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={"filter-pill " + (active ? "filter-pill-active" : "filter-pill-idle")}>{children}</button>;
}

export function CategoryDetailClient({ category, prompts }: CategoryDetailClientProps) {
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<PromptSort>("latest");
  const results = useMemo(() => searchPrompts(prompts, { tag, sort }), [prompts, tag, sort]);

  return (
    <div className="space-y-5 md:space-y-7">
      <div className="filter-stack">
        <div className="filter-row"><span className="filter-label">标签</span><Pill active={tag === "all"} onClick={() => setTag("all")}>全部</Pill>{(category.tags ?? []).map((item) => <Pill key={item} active={tag === item} onClick={() => setTag(item)}>{item}</Pill>)}</div>
        <div className="filter-row"><span className="filter-label">排序</span>{sortOptions.map((item) => <Pill key={item.value} active={sort === item.value} onClick={() => setSort(item.value)}>{item.label}</Pill>)}</div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-gray-500">共 {results.length} 个提示词</p><Button href="/categories" variant="secondary">返回全部分类</Button></div>
      {results.length > 0 ? <><MasonryPromptGrid prompts={results} /><LoadMoreButton /></> : <EmptyState title="这个筛选下暂时没有结果" description="可以换一个标签，或者回到全部分类查看其他提示词。" actionHref="/categories" actionLabel="返回全部分类" />}
    </div>
  );
}
