import { notFound } from "next/navigation";
import { PromptDetail } from "@/components/prompts/PromptDetail";
import { getAllPrompts, getPromptBySlug, getRelatedPrompts } from "@/lib/prompts";

type PromptDetailPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) notFound();
  const relatedPrompts = getRelatedPrompts(prompt, 6);

  return (
    <section className="page-shell">
      <PromptDetail prompt={prompt} relatedPrompts={relatedPrompts} />
    </section>
  );
}
