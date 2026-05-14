import promptsData from "@/data/prompts.json";
import type { PromptItem, PromptSort } from "@/types/prompt";

const prompts = promptsData as PromptItem[];

export function getAllPrompts() {
  return prompts;
}

export function getFeaturedPrompts(limit = 6) {
  const featured = prompts.filter((prompt) => prompt.isFeatured);
  return (featured.length > 0 ? featured : prompts).slice(0, limit);
}

export function getPromptBySlug(slug: string) {
  return prompts.find((prompt) => prompt.slug === slug);
}

export function getPromptsByCategory(categorySlug: string) {
  return prompts.filter((prompt) => prompt.categorySlug === categorySlug);
}

export function getRelatedPrompts(prompt: PromptItem, limit = 6) {
  const currentTags = prompt.tags ?? [];

  return prompts
    .filter((item) => item.slug !== prompt.slug)
    .map((item) => {
      const categoryScore = item.categorySlug === prompt.categorySlug ? 3 : 0;
      const tagScore = (item.tags ?? []).filter((tag) => currentTags.includes(tag)).length;
      return { item, score: categoryScore + tagScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (b.item.views ?? 0) - (a.item.views ?? 0))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function sortPrompts(items: PromptItem[], sort: PromptSort) {
  return [...items].sort((a, b) => {
    if (sort === "popular") {
      return (b.views ?? 0) - (a.views ?? 0);
    }

    if (sort === "favorites") {
      return (b.favorites ?? 0) - (a.favorites ?? 0);
    }

    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });
}

export function getPromptStats() {
  const tags = new Set(prompts.flatMap((prompt) => prompt.tags));
  const sources = new Set(prompts.map((prompt) => prompt.sourceUrl));

  return {
    promptCount: prompts.length,
    tagCount: tags.size,
    sourceCount: sources.size,
  };
}
