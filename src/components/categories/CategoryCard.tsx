import Link from "next/link";
import { PromptImage } from "@/components/prompts/PromptImage";
import type { CategoryItem } from "@/types/category";

type CategoryCardProps = { category: CategoryItem };

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="soft-card soft-hover group overflow-hidden rounded-[22px]">
      <PromptImage className="aspect-[4/3]" src={category.coverImage ?? ""} alt={category.name} fit="contain" sizes="(max-width: 768px) 50vw, 20vw" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-black text-zinc-950">{category.name}</h3><span className="rounded-full bg-[#f1ecff] px-3 py-1 text-xs font-bold text-violet-700">{category.promptCount ?? 0} 个</span></div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{category.description}</p>
      </div>
    </Link>
  );
}
