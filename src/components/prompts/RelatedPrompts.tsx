import Link from "next/link";
import { PromptImage } from "@/components/prompts/PromptImage";
import { formatNumber } from "@/lib/format";
import type { PromptItem } from "@/types/prompt";

type RelatedPromptsProps = { prompts: PromptItem[] };

export function RelatedPrompts({ prompts }: RelatedPromptsProps) {
  if (prompts.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-xl font-black text-zinc-950">相关推荐</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {prompts.slice(0, 4).map((prompt) => (
          <Link href={`/prompts/${prompt.slug}`} key={prompt.id} className="soft-card soft-hover overflow-hidden rounded-[18px]">
            <PromptImage className="aspect-[4/3]" src={prompt.coverImage} alt={prompt.title} fit="contain" sizes="25vw" />
            <div className="p-3"><p className="line-clamp-1 text-sm font-black text-zinc-900">{prompt.title}</p><p className="mt-2 text-xs text-gray-500">👁 {formatNumber(prompt.views)}</p></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
