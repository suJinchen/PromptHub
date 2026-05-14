import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/format";
import type { PromptItem } from "@/types/prompt";
import { CopyPromptButton } from "./CopyPromptButton";
import { PromptImage } from "./PromptImage";

type PromptCardProps = { prompt: PromptItem };

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(109,74,255,.12)]">
      <Link className="relative block" href={`/prompts/${prompt.slug}`}>
        <PromptImage className="aspect-[4/3]" src={prompt.coverImage} alt={prompt.title} fit="contain" />
        <span className="absolute left-3 top-3 rounded-full bg-white/88 px-2.5 py-1 text-xs font-bold text-violet-700 shadow-sm backdrop-blur">{prompt.category}</span>
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/82 text-gray-500 shadow-sm backdrop-blur">♡</span>
      </Link>
      <div className="p-4">
        <Link href={`/prompts/${prompt.slug}`}><h3 className="line-clamp-1 text-base font-black text-zinc-950 transition hover:text-violet-700">{prompt.title}</h3></Link>
        <p className="mt-2 line-clamp-1 text-xs text-gray-500">{prompt.tags.slice(0, 3).join(" · ")}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-3 text-xs font-semibold text-gray-500"><span>♡ {formatNumber(prompt.favorites)}</span><span>👁 {formatNumber(prompt.views)}</span></div>
          <CopyPromptButton text={prompt.englishPrompt} />
        </div>
      </div>
    </Card>
  );
}
