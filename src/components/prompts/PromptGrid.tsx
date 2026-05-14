import type { PromptItem } from "@/types/prompt";
import { PromptCard } from "./PromptCard";

type PromptGridProps = { prompts: PromptItem[] };

export function PromptGrid({ prompts }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-zinc-900">暂时没有匹配的提示词</p>
        <p className="mt-2 text-sm text-gray-500">换一个关键词，或减少筛选条件再试试。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
    </div>
  );
}
