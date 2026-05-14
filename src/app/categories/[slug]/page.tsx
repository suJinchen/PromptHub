import { notFound } from "next/navigation";
import { CategoryDetailClient } from "@/components/categories/CategoryDetailClient";
import { Badge } from "@/components/ui/Badge";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";
import { getPromptsByCategory } from "@/lib/prompts";

type CategoryDetailPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const prompts = getPromptsByCategory(category.slug);

  return (
    <section className="page-shell">
      <div className="mb-9 max-w-3xl">
        <p className="text-sm font-bold text-violet-600">分类 / {category.name}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">{category.name}</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">{category.description}</p>
        <div className="mt-5 flex flex-wrap gap-2"><Badge>{prompts.length} 个提示词</Badge>{(category.tags ?? []).slice(0, 5).map((tag) => <Badge tone="gray" key={tag}>{tag}</Badge>)}</div>
      </div>
      <CategoryDetailClient category={category} prompts={prompts} />
    </section>
  );
}
