import type { PromptItem } from "@/types/prompt";
import { MasonryPromptCard } from "./MasonryPromptCard";

type MasonryPromptGridProps = { prompts: PromptItem[] };

export function MasonryPromptGrid({ prompts }: MasonryPromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-violet-200 bg-white/78 px-6 py-14 text-center shadow-[0_18px_46px_rgba(24,24,27,.045)]">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#f1ecff] text-violet-600">✦</div>
        <h3 className="mt-4 text-lg font-black text-zinc-950">暂无匹配提示词</h3>
        <p className="mt-2 text-sm text-gray-500">换个关键词、分类或标签试试看。</p>
      </div>
    );
  }

  return (
    <div className="prompt-masonry">
      {prompts.map((prompt) => (
        <MasonryPromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
