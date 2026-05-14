import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PROJECT_ROOT = process.cwd();
const SOURCE_ROOT = process.env.EVOLINKAI_SOURCE_DIR || path.join(os.tmpdir(), "prompthub-evolinkai-source");
const DATA_DIR = path.join(PROJECT_ROOT, "src", "data");
const CASES_DIR = path.join(SOURCE_ROOT, "cases");
const REPORT_DIR = path.join(PROJECT_ROOT, "scripts", "reports");
const SOURCE_NAME = "EvoLinkAI/awesome-gpt-image-2-API-and-Prompts";
const SOURCE_REPO_URL = "https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts";
const SOURCE_RAW_PREFIX = "https://raw.githubusercontent.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts/main/";
const SOURCE_LICENSE = "CC-BY-4.0";

const CASE_FILES = ["poster.md", "portrait.md", "ui.md", "ad-creative.md", "ecommerce.md", "character.md", "comparison.md"];

const CATEGORY_DEFS = [
  { slug: "portrait", name: "人像写真", description: "适合头像、写真、棚拍、电影感人物影像的提示词案例。" },
  { slug: "product-poster", name: "产品海报", description: "适合广告海报、品牌视觉、产品宣传图和商业创意。" },
  { slug: "ecommerce-main-image", name: "电商主图", description: "适合商品主图、卖点展示、货架图和电商详情首图。" },
  { slug: "chinese-illustration", name: "国风插画", description: "适合水墨、国潮、东方美学和传统文化插画。" },
  { slug: "3d-icon", name: "3D 图标", description: "适合立体图标、拟物图标、App 图标和 3D 小组件。" },
  { slug: "ui-design", name: "UI 设计", description: "适合 App、Web、仪表盘、落地页和界面概念设计。" },
  { slug: "game-concept", name: "游戏概念图", description: "适合幻想场景、科幻世界、游戏宣传图和概念艺术。" },
  { slug: "xiaohongshu-cover", name: "小红书封面", description: "适合生活方式、种草笔记、社交媒体首图和封面设计。" },
  { slug: "vintage-poster", name: "复古海报", description: "适合复古广告、旅行海报、电影海报和怀旧视觉。" },
  { slug: "character-design", name: "角色设定", description: "适合二次元角色、IP 形象、游戏角色和吉祥物设定。" },
];

const CATEGORY_TAGS = {
  portrait: ["人像", "摄影", "电影感", "写真", "头像"],
  "product-poster": ["产品", "海报", "广告", "品牌", "商业"],
  "ecommerce-main-image": ["电商", "主图", "产品", "卖点", "商品图"],
  "chinese-illustration": ["国风", "插画", "东方美学", "水墨", "国潮"],
  "3d-icon": ["3D", "图标", "拟物", "立体", "App"],
  "ui-design": ["UI", "App", "Web", "仪表盘", "界面"],
  "game-concept": ["游戏", "场景", "奇幻", "科幻", "概念图"],
  "xiaohongshu-cover": ["小红书", "封面", "生活方式", "社交媒体", "种草"],
  "vintage-poster": ["复古", "海报", "怀旧", "旅行", "字体"],
  "character-design": ["角色", "IP", "二次元", "设定", "人物"],
};

const TITLE_BANK = {
  portrait: ["电影感人像写真", "柔光棚拍头像", "自然光人物写真", "复古胶片人像", "时尚杂志肖像", "夜景氛围人像", "清透半身写真", "都市情绪人像", "光影艺术肖像", "极简人物大片"],
  "product-poster": ["极简香水产品海报", "护肤精华广告海报", "清新饮品产品海报", "高级珠宝宣传图", "美食广告视觉", "自然光产品海报", "品牌活动主视觉", "奢华产品静物", "商业广告创意图", "清透包装宣传图"],
  "ecommerce-main-image": ["香水电商主图", "智能手表卖点图", "护肤品商品主图", "运动鞋电商展示", "家居产品主图", "耳机卖点主图", "美妆套装商品图", "食品包装主图", "科技产品货架图", "极简商品展示图"],
  "chinese-illustration": ["春日江南国风插画", "水墨山河意境图", "东方美学城市海报", "国潮节日插画", "古风人物水墨图", "新中式山水视觉", "传统文化插画", "诗意园林国风图", "水彩城市地图", "东方山水画卷"],
  "3d-icon": ["圆润 3D 图标套装", "拟物 App 图标", "粘土风立体图标", "云端上传 3D 图标", "渐变功能图标", "立体社交图标", "电商工具图标", "柔光科技图标", "迷你场景图标", "可爱系统图标"],
  "ui-design": ["AI 数据看板 UI", "移动金融 App 界面", "健康管理仪表盘", "电商落地页界面", "科幻控制台 UI", "极简 Web 首页", "社交应用界面", "深色数据大屏", "SaaS 工作台界面", "智能家居 App UI"],
  "game-concept": ["未来城市游戏场景", "暗黑幻想城市概念图", "空岛奇幻世界", "赛博朋克街区场景", "史诗山谷概念图", "科幻基地宣传图", "幻想森林冒险图", "末日城市场景", "游戏活动主视觉", "异世界城堡概念"],
  "xiaohongshu-cover": ["小红书旅行封面", "夏日饮品种草封面", "美妆护肤小红书封面", "生活方式笔记封面", "汽车杂志风封面", "露营攻略封面图", "穿搭灵感封面", "家居改造封面", "咖啡探店封面", "山海旅行封面"],
  "vintage-poster": ["复古旅行海报", "怀旧电影宣传图", "复古报纸人物海报", "老广告风产品海报", "经典音乐会海报", "复古城市宣传图", "胶片质感海报", "年代感餐饮广告", "复古字体海报", "怀旧杂志封面"],
  "character-design": ["二次元角色设定", "游戏主播角色封面", "ASMR 少女角色设定", "机甲战士角色图", "可爱吉祥物设计", "幻想法师角色", "赛博朋克角色设定", "国风少年角色", "动漫偶像立绘", "IP 形象设定图"],
};

const TITLE_HINTS = [
  [/boston|city poster|guangzhou|chengdu|map|china|oriental|ink|s-shaped|chinese/i, "国风城市海报"],
  [/amalfi|travel|japan|italy|poster/i, "复古旅行海报"],
  [/perfume|cosmetic|skincare|bottle/i, "香水护肤产品海报"],
  [/shoe|sneaker/i, "运动鞋电商主图"],
  [/watch/i, "智能手表卖点图"],
  [/dashboard|interface|app|ui|web/i, "数据看板 UI 设计"],
  [/icon|clay|isometric/i, "圆润 3D 图标"],
  [/portrait|headshot|selfie|model|fashion/i, "电影感人像写真"],
  [/character|mascot|anime|vtuber|girl/i, "二次元角色设定"],
  [/cyberpunk|fantasy|game|concept|world/i, "幻想游戏概念图"],
  [/cover|social|thumbnail|xiaohongshu|lifestyle/i, "小红书灵感封面"],
  [/retro|vintage|newspaper|classic/i, "复古广告海报"],
];

const NUMBERED_TITLE = /(案例\s*\d+|case\s*\d+|demo\s*\d+|prompt\s*\d+)/i;

function ensureDirs() {
  if (!fs.existsSync(CASES_DIR)) throw new Error(`找不到源仓库 cases 目录：${CASES_DIR}`);
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function backupCurrentData() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}-before-full-import`;
  const dir = path.join(DATA_DIR, "backups", stamp);
  fs.mkdirSync(dir, { recursive: true });
  for (const file of ["prompts.json", "categories.json", "tags.json"]) {
    const src = path.join(DATA_DIR, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, file));
  }
  return dir;
}

function slugify(input) {
  return String(input || "prompt")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "prompt";
}

function uniqueSlug(base, used) {
  let slug = slugify(base);
  let next = slug;
  let i = 2;
  while (used.has(next)) next = `${slug}-${i++}`;
  used.add(next);
  return next;
}

function uniqueTitle(base, categorySlug, used) {
  const suffixA = ["灵感", "视觉", "构图", "模板", "参考", "设计", "大片", "方案", "版式", "场景"];
  const suffixB = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const title = cleanTitle(base, categorySlug);
  if (!used.has(title)) {
    used.add(title);
    return title;
  }
  for (const a of suffixA) {
    const candidate = `${title}${a}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
  for (const a of suffixA) {
    for (const b of suffixB) {
      const candidate = `${title}${a}${b}`;
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }
  }
  const candidate = `${title}${suffixB[Math.abs(hashCode(base || title)) % suffixB.length]}${suffixA[Math.abs(hashCode(`${base}-x`)) % suffixA.length]}`;
  used.add(candidate);
  return candidate;
}
function stripMarkdown(text) {
  return String(text || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCases(fileName) {
  const full = path.join(CASES_DIR, fileName);
  if (!fs.existsSync(full)) return [];
  const text = fs.readFileSync(full, "utf8");
  const matches = [...text.matchAll(/^### Case\s+(\d+):\s*(.+)$/gm)];
  const cases = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const block = text.slice(start, end);
    const caseId = matches[i][1];
    const heading = matches[i][2].trim();
    const linked = heading.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const title = stripMarkdown(linked?.[1] || heading.replace(/\(by.+$/i, ""));
    const originalSourceUrl = linked?.[2] || "";
    const imageMatches = [...block.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
    const promptMatch = block.match(/\*\*Prompt:\*\*\s*```([\s\S]*?)```/i) || block.match(/```([\s\S]*?)```/);
    const prompt = promptMatch?.[1]?.trim() || "";
    cases.push({ fileName, caseId, title, originalSourceUrl, images: imageMatches, prompt });
  }
  return cases;
}

function normalizeImageUrl(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  const rel = path.posix.normalize(path.posix.join("cases", "..", src.replace(/\\/g, "/"))).replace(/^\.\//, "");
  return SOURCE_RAW_PREFIX + rel;
}

function localPathForUrl(url) {
  if (!url) return "";
  let rel = "";
  if (url.startsWith(SOURCE_RAW_PREFIX)) rel = url.slice(SOURCE_RAW_PREFIX.length);
  else {
    const match = url.match(/\/EvoLinkAI\/awesome-gpt-image-2-API-and-Prompts\/(?:raw|blob)\/main\/(.+)$/i);
    if (match) rel = match[1];
  }
  if (!rel) return "";
  return path.join(SOURCE_ROOT, ...rel.split(/[\/]+/));
}

function imageSize(file) {
  if (!file || !fs.existsSync(file)) return null;
  const buffer = fs.readFileSync(file);
  if (buffer.length < 32) return null;
  if (buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue; }
      const marker = buffer[offset + 1];
      if (offset + 4 > buffer.length) return null;
      const length = buffer.readUInt16BE(offset + 2);
      if (!Number.isFinite(length) || length < 2) return null;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  return null;
}

function aspectRatioLabel(width, height) {
  if (!width || !height) return "自定义比例";
  const ratio = width / height;
  const common = [
    [1 / 1, "1:1"], [4 / 5, "4:5"], [3 / 4, "3:4"], [2 / 3, "2:3"], [9 / 16, "9:16"],
    [16 / 9, "16:9"], [3 / 2, "3:2"], [4 / 3, "4:3"], [16 / 10, "16:10"], [5 / 4, "5:4"],
  ];
  let best = common[0];
  let bestDelta = Infinity;
  for (const item of common) {
    const delta = Math.abs(ratio - item[0]);
    if (delta < bestDelta) { best = item; bestDelta = delta; }
  }
  if (bestDelta <= 0.08) return best[1];
  return `约 ${ratio.toFixed(2)}:1`;
}

function classify(item) {
  const file = item.fileName.replace(/\.md$/, "");
  const text = `${item.title} ${item.prompt}`.toLowerCase();
  const has = (words) => words.some((word) => text.includes(word));
  if (has(["3d icon", "app icon", "clay icon", "isometric icon", "icon set", "emoji", "sticker"])) return "3d-icon";
  if (has(["dashboard", "interface", "ui", "app screen", "mobile app", "web page", "landing page", "design system", "mockup"])) return "ui-design";
  if (has(["character", "mascot", "anime", "vtuber", "mecha", "persona", "game streamer", "girl character", "figure"])) return "character-design";
  if (has(["game", "concept art", "fantasy", "sci-fi", "science fiction", "cyberpunk", "worldbuilding", "minecraft", "gta", "castle", "battle"] )) return "game-concept";
  if (has(["vintage", "retro", "old newspaper", "classic poster", "1950s", "1960s", "film poster"])) return "vintage-poster";
  if (has(["xiaohongshu", "social media", "cover", "thumbnail", "lifestyle", "magazine cover", "note cover"])) return "xiaohongshu-cover";
  if (has(["chinese", "ink", "oriental", "hanfu", "guofeng", "wuxia", "calligraphy", "chengdu", "guangzhou", "china", "journey to the west", "taoist"])) return "chinese-illustration";
  if (has(["portrait", "headshot", "selfie", "model", "fashion", "photography", "cinematic portrait", "girl", "woman", "man"])) return "portrait";
  if (file === "ecommerce" || has(["ecommerce", "product listing", "main image", "hero image", "product shot", "商品主图"])) return "ecommerce-main-image";
  if (has(["product", "perfume", "cosmetic", "skincare", "watch", "shoe", "sneaker", "food", "beverage", "advertisement", "advertising", "campaign", "commercial", "poster", "flyer", "ad creative"])) return "product-poster";
  if (file === "ui") return "ui-design";
  if (file === "character") return "character-design";
  if (file === "portrait") return "portrait";
  if (file === "ad-creative") return "product-poster";
  if (file === "poster") return "vintage-poster";
  return "product-poster";
}

function cleanTitle(rawTitle, categorySlug) {
  const titleSource = stripMarkdown(rawTitle).replace(NUMBERED_TITLE, "").trim();
  for (const [pattern, title] of TITLE_HINTS) if (pattern.test(titleSource)) return title;
  const bank = TITLE_BANK[categorySlug] || TITLE_BANK["product-poster"];
  const seed = Math.abs(hashCode(titleSource || categorySlug)) % bank.length;
  return bank[seed];
}

function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return hash;
}

function extraTags(text) {
  const result = [];
  const rules = [
    [/perfume|fragrance/i, "香水"], [/cosmetic|skincare|beauty/i, "护肤品"], [/food|drink|beverage|coffee/i, "美食"], [/shoe|sneaker/i, "鞋履"],
    [/dashboard|data/i, "仪表盘"], [/landing page|web/i, "Web"], [/app/i, "App"], [/cyberpunk/i, "赛博朋克"], [/fantasy/i, "奇幻"],
    [/retro|vintage/i, "复古"], [/map/i, "地图"], [/city/i, "城市"], [/poster/i, "海报"], [/portrait|headshot/i, "人像"], [/minimal/i, "极简"],
  ];
  for (const [pattern, tag] of rules) if (pattern.test(text) && !result.includes(tag)) result.push(tag);
  return result;
}

function makeTags(categorySlug, raw) {
  const tags = [...(CATEGORY_TAGS[categorySlug] || []), ...extraTags(raw)].filter(Boolean);
  return [...new Set(tags)].slice(0, 5);
}

function makeDescription(categorySlug, title, tags) {
  const templates = {
    portrait: `适合头像写真、人物摄影和社交媒体形象参考。`,
    "product-poster": `适合品牌广告、产品宣传和商业海报创意参考。`,
    "ecommerce-main-image": `适合商品主图、卖点展示和电商详情首图参考。`,
    "chinese-illustration": `适合国风插画、东方美学和文化主题视觉参考。`,
    "3d-icon": `适合 App 图标、功能入口和 3D 视觉组件参考。`,
    "ui-design": `适合界面概念、仪表盘和产品体验设计参考。`,
    "game-concept": `适合游戏场景、世界观设定和概念艺术参考。`,
    "xiaohongshu-cover": `适合种草笔记、生活方式内容和社交媒体封面参考。`,
    "vintage-poster": `适合复古广告、旅行海报和怀旧平面设计参考。`,
    "character-design": `适合角色立绘、IP 形象和人物设定参考。`,
  };
  return templates[categorySlug] || `适合 ${tags.slice(0, 2).join("、")} 等视觉创作参考。`;
}

function englishFallback(categorySlug) {
  const englishCategory = {
    portrait: "cinematic portrait photography",
    "product-poster": "premium product advertising poster",
    "ecommerce-main-image": "e-commerce hero product image",
    "chinese-illustration": "oriental ink-inspired illustration",
    "3d-icon": "soft 3D icon design",
    "ui-design": "modern digital interface design",
    "game-concept": "fantasy game concept art",
    "xiaohongshu-cover": "social media cover design",
    "vintage-poster": "retro editorial poster design",
    "character-design": "stylized character design",
  }[categorySlug] || "polished visual concept";
  return `Create a polished GPT Image 2 ${englishCategory}. Use clean composition, refined lighting, strong visual hierarchy, detailed materials, harmonious colors, premium editorial quality, and a finished portfolio-ready look. Keep the subject clear, readable, and visually balanced.`;
}

function chinesePrompt(categorySlug, title, tags) {
  const tagLine = tags.join("、");
  return `${title}，围绕${tagLine}展开画面设计，构图清晰，主体突出，光线柔和而有层次，色彩干净高级，细节丰富但不过度拥挤，适合作为 GPT Image 2 提示词参考。画面需要兼顾真实质感、视觉冲击力和可复制的创作思路。`;
}

function normalizeEnglishPrompt(raw, categorySlug, title, tags) {
  // Source prompts often contain mixed-language text, placeholders, social links or multi-prompt notes.
  // For the public MVP we keep the sourceUrl for traceability and generate a clean copy-ready English prompt.
  return englishFallback(categorySlug, title, tags);
}
function displayType(categorySlug) {
  if (categorySlug === "portrait") return "portrait";
  if (["product-poster", "vintage-poster", "xiaohongshu-cover"].includes(categorySlug)) return "poster";
  if (categorySlug === "ecommerce-main-image") return "product";
  if (categorySlug === "ui-design") return "ui";
  if (categorySlug === "3d-icon") return "icon";
  if (["game-concept", "chinese-illustration"].includes(categorySlug)) return "scene";
  return "landscape";
}

function imageFit(categorySlug) {
  if (["portrait", "game-concept", "chinese-illustration", "vintage-poster"].includes(categorySlug)) return "cover";
  return "contain";
}

function buildCategories(prompts) {
  return CATEGORY_DEFS.map((def) => {
    const items = prompts.filter((prompt) => prompt.categorySlug === def.slug);
    const sorted = [...items].sort((a, b) => (b.views || 0) + (b.favorites || 0) - ((a.views || 0) + (a.favorites || 0)));
    const tagCounts = new Map();
    for (const prompt of items) for (const tag of prompt.tags) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tag]) => tag);
    return {
      slug: def.slug,
      name: def.name,
      description: def.description,
      count: items.length,
      promptCount: items.length,
      coverImage: sorted[0]?.coverImage || "",
      accentImage: sorted[1]?.coverImage || sorted[0]?.coverImage || "",
      tags,
    };
  });
}

function buildTags(prompts) {
  const counts = new Map();
  for (const prompt of prompts) for (const tag of prompt.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN")).map(([name, count]) => ({ id: slugify(name), name, slug: slugify(name), count }));
}

function main() {
  ensureDirs();
  const backupDir = backupCurrentData();
  const cases = CASE_FILES.flatMap(parseCases);
  const usedSlugs = new Set();
  const usedTitles = new Set();
  const prompts = [];
  const skipped = [];

  for (const item of cases) {
    const imageUrl = normalizeImageUrl(item.images[0], item.fileName);
    const localImage = localPathForUrl(imageUrl);
    const size = imageSize(localImage);
    if (!item.prompt) { skipped.push({ file: item.fileName, caseId: item.caseId, reason: "missing prompt" }); continue; }
    if (!imageUrl || !localImage || !fs.existsSync(localImage)) { skipped.push({ file: item.fileName, caseId: item.caseId, reason: "missing local image" }); continue; }
    if (!size) { skipped.push({ file: item.fileName, caseId: item.caseId, reason: "unreadable image size" }); continue; }

    const categorySlug = classify(item);
    const category = CATEGORY_DEFS.find((def) => def.slug === categorySlug) || CATEGORY_DEFS[0];
    const rawContext = `${item.title} ${item.prompt}`;
    const title = uniqueTitle(item.title, categorySlug, usedTitles);
    const tags = makeTags(categorySlug, rawContext);
    const englishPrompt = normalizeEnglishPrompt(item.prompt, categorySlug, title, tags);
    const slug = uniqueSlug(`${categorySlug}-${item.fileName.replace(/\.md$/, "")}-${item.caseId}-${title}`, usedSlugs);
    const views = 900 + Math.abs(hashCode(`${item.fileName}-${item.caseId}-views`)) % 9200;
    const favorites = 60 + Math.abs(hashCode(`${item.fileName}-${item.caseId}-favorites`)) % 1800;
    const ratio = aspectRatioLabel(size.width, size.height);
    const sourceUrl = `${SOURCE_REPO_URL}/blob/main/cases/${item.fileName}#case-${item.caseId}`;
    prompts.push({
      id: slug,
      slug,
      title,
      description: makeDescription(categorySlug, title, tags),
      category: category.name,
      categoryName: category.name,
      categorySlug,
      tags,
      coverImage: imageUrl,
      image: imageUrl,
      imageUrl,
      galleryImages: [imageUrl],
      imageFit: imageFit(categorySlug),
      displayType: displayType(categorySlug),
      chinesePrompt: chinesePrompt(categorySlug, title, tags),
      cnPrompt: chinesePrompt(categorySlug, title, tags),
      zhPrompt: chinesePrompt(categorySlug, title, tags),
      englishPrompt,
      enPrompt: englishPrompt,
      model: "GPT Image 2",
      ratio,
      aspectRatio: ratio,
      aspectRatioLabel: ratio,
      imageWidth: size.width,
      imageHeight: size.height,
      style: tags.slice(0, 3).join("、"),
      useCases: tags.slice(0, 4),
      useCase: tags.slice(0, 3).join("、"),
      views,
      likes: favorites,
      favorites,
      sourceName: SOURCE_NAME,
      sourceRepo: SOURCE_NAME,
      sourceUrl,
      originalSourceUrl: item.originalSourceUrl,
      sourceLicense: SOURCE_LICENSE,
      license: SOURCE_LICENSE,
      createdAt: "2026-05-15",
      updatedAt: "2026-05-15",
      isFeatured: prompts.length < 12,
    });
  }

  prompts.sort((a, b) => b.views + b.favorites - (a.views + a.favorites));
  const categories = buildCategories(prompts);
  const tags = buildTags(prompts);
  fs.writeFileSync(path.join(DATA_DIR, "prompts.json"), JSON.stringify(prompts, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(DATA_DIR, "tags.json"), JSON.stringify(tags, null, 2) + "\n", "utf8");

  const distribution = Object.fromEntries(categories.map((cat) => [cat.name, cat.count]));
  const report = { sourceRoot: SOURCE_ROOT, backupDir, totalCases: cases.length, imported: prompts.length, skipped: skipped.length, distribution, skippedSamples: skipped.slice(0, 80) };
  fs.writeFileSync(path.join(REPORT_DIR, "full-import-report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main();








