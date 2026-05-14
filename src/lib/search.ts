import type { PromptItem, PromptSort } from "@/types/prompt";
import { sortPrompts } from "@/lib/prompts";

type PromptSearchOptions = {
  query?: string;
  category?: string;
  tag?: string;
  sort?: PromptSort;
};

const weakSuffixes = ["提示词", "案例", "模板", "风格", "生成", "设计", "图片", "照片", "图", "ai"];

const aliasGroups = [
  ["电商图", "电商", "主图", "商品图", "商品主图", "卖点图", "电商主图", "商品", "卖点"],
  ["产品图", "产品海报", "商品海报", "广告图", "产品", "海报", "广告", "护肤品", "香水", "包装"],
  ["人像图", "头像", "写真", "人物照", "肖像", "人像", "摄影", "照片", "电影感"],
  ["海报", "封面", "小红书图", "小红书封面", "小红书", "复古海报", "旅行海报", "版式"],
  ["ui", "界面", "app", "app界面", "网页", "web", "仪表盘", "看板", "设计系统"],
  ["3d", "3d图标", "图标", "icon", "立体图标", "圆润", "拟物"],
  ["游戏", "场景", "概念图", "赛博朋克", "科幻", "奇幻", "角色"],
  ["国风", "古风", "水墨", "东方美学", "插画", "山水", "文旅", "国潮"],
  ["复古", "怀旧", "报纸", "电影海报", "杂志", "经典"],
  ["角色", "二次元", "IP", "立绘", "吉祥物", "动漫"],
];

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

function stripWeakSuffixes(value: string) {
  let result = value;
  for (const suffix of weakSuffixes) {
    result = result.replace(new RegExp(suffix, "gi"), "");
  }
  return result;
}

function queryTerms(rawQuery: string) {
  const normalized = normalize(rawQuery);
  if (!normalized) return [];

  const terms = new Set<string>([normalized]);
  const stripped = stripWeakSuffixes(normalized);
  if (stripped) terms.add(stripped);

  for (const group of aliasGroups) {
    const normalizedGroup = group.map(normalize);
    if (normalizedGroup.some((alias) => normalized.includes(alias) || alias.includes(normalized) || Boolean(stripped && alias.includes(stripped)))) {
      normalizedGroup.forEach((alias) => terms.add(alias));
    }
  }

  for (const part of normalized.split(/[，、\s|_-]+/).filter(Boolean)) {
    terms.add(part);
    const weak = stripWeakSuffixes(part);
    if (weak) terms.add(weak);
  }

  return Array.from(terms).filter((term) => term.length > 0);
}

function getSearchText(prompt: PromptItem) {
  return normalize(
    [
      prompt.title,
      prompt.category,
      prompt.categoryName ?? "",
      (prompt.tags ?? []).join(" "),
      prompt.englishPrompt,
      prompt.enPrompt ?? "",
      prompt.chinesePrompt,
      prompt.cnPrompt ?? "",
      prompt.zhPrompt ?? "",
      prompt.description,
      prompt.style ?? "",
      prompt.aspectRatio ?? "",
      prompt.ratio ?? "",
      (prompt.useCases ?? []).join(" "),
      prompt.useCase ?? "",
    ].join(" "),
  );
}

function fuzzyMatch(prompt: PromptItem, query: string) {
  const terms = queryTerms(query);
  if (terms.length === 0) return true;

  const searchText = getSearchText(prompt);
  if (terms.some((term) => searchText.includes(term))) return true;

  const compactTitle = normalize(prompt.title);
  const compactCategory = normalize(prompt.category || prompt.categoryName || "");
  return terms.some((term) => compactTitle.includes(term) || compactCategory.includes(term));
}

export function searchPrompts(items: PromptItem[], options: PromptSearchOptions) {
  const query = options.query ?? "";
  const category = options.category ?? "all";
  const tag = options.tag ?? "all";
  const sort = options.sort ?? "latest";

  const filtered = items.filter((prompt) => {
    const matchesQuery = fuzzyMatch(prompt, query);
    const matchesCategory = category === "all" || prompt.categorySlug === category;
    const matchesTag = tag === "all" || (prompt.tags ?? []).includes(tag);

    return matchesQuery && matchesCategory && matchesTag;
  });

  return sortPrompts(filtered, sort);
}
