import type { Metadata } from "next";
﻿import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { getAllCategories } from "@/lib/categories";


export const metadata: Metadata = {
  title: "分类 - PromptHub",
  description: "按创作用途快速找到适合的 GPT Image 2 提示词。",
};
export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <section className="page-shell">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">分类</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">按创作用途快速找到适合的 GPT Image 2 提示词。</p>
      </div>
      <CategoryGrid categories={categories} />
    </section>
  );
}
