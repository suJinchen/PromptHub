import Link from "next/link";
import { PromptImage } from "@/components/prompts/PromptImage";
import type { CategoryItem } from "@/types/category";

type CategoryStripProps = { categories: CategoryItem[] };

export function CategoryStrip({ categories }: CategoryStripProps) {
  const items = categories.slice(0, 6);
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2"><span className="text-violet-600">✦</span><h2 className="text-xl font-black text-zinc-950 sm:text-2xl">探索分类</h2></div>
        <Link href="/categories" className="text-sm font-bold text-violet-600 hover:text-violet-500">查看全部分类 →</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.id} className="soft-card soft-hover flex items-center justify-between gap-3 rounded-2xl p-4">
            <div><h3 className="text-sm font-black text-zinc-950">{category.name}</h3><p className="mt-1 text-xs text-gray-500">{category.promptCount ?? 0} 个提示词</p></div>
            <PromptImage className="size-16 shrink-0 rounded-2xl" src={category.coverImage ?? ""} alt={category.name} fit="contain" sizes="96px" />
          </Link>
        ))}
      </div>
    </section>
  );
}
