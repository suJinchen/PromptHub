import { PromptImage } from "@/components/prompts/PromptImage";
import type { PromptItem } from "@/types/prompt";

const fallbackHeroImages = [
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85",
];

function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getHeroBackgroundImage(prompts: PromptItem[]) {
  const scenePrompts = prompts
    .filter((prompt) => !["portrait", "ui-design", "3d-icons"].includes(prompt.categorySlug))
    .sort((a, b) => (b.views ?? 0) + (b.favorites ?? 0) * 8 - ((a.views ?? 0) + (a.favorites ?? 0) * 8));
  const dailyIndex = getDayOfYear() % fallbackHeroImages.length;
  return scenePrompts[dailyIndex]?.coverImage || fallbackHeroImages[dailyIndex] || fallbackHeroImages[0];
}

type HeroVisualProps = { prompts: PromptItem[] };

export function HeroVisual({ prompts }: HeroVisualProps) {
  const image = getHeroBackgroundImage(prompts);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[72%]">
        <PromptImage className="h-full w-full" src={image} alt="PromptHub 首页柔和场景背景" priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.94)_28%,rgba(255,255,255,.64)_54%,rgba(255,255,255,.12)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(255,255,255,.76)_94%)]" />
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-violet-100/70 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafc] to-transparent" />
    </div>
  );
}
