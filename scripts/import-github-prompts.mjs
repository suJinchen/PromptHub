import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoUrl = "https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts.git";
const repoName = "EvoLinkAI/awesome-gpt-image-2-API-and-Prompts";
const sourceRoot = path.join(os.tmpdir(), "prompthub-evolinkai-source");
const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, "src", "data");
const targetCount = Number(process.env.PROMPTHUB_IMPORT_LIMIT || process.argv[2] || 100);

const sourceFiles = ["portrait.md", "ecommerce.md", "ad-creative.md", "ui.md", "character.md", "poster.md", "comparison.md"];

const categories = [
  {
    slug: "portrait",
    name: "人像写真",
    description: "适合头像、写真、电影感肖像和社交媒体人物视觉的提示词案例。",
    icon: "portrait",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    slug: "product-poster",
    name: "产品海报",
    description: "适合广告视觉、品牌宣传、产品大片和商业海报的提示词案例。",
    icon: "poster",
    accent: "from-purple-500 to-sky-500",
  },
  {
    slug: "ecommerce-main-image",
    name: "电商主图",
    description: "适合商品展示、卖点表达、电商首图和平台详情视觉的提示词案例。",
    icon: "shopping",
    accent: "from-blue-500 to-violet-500",
  },
  {
    slug: "chinese-illustration",
    name: "国风插画",
    description: "适合东方美学、水墨、城市文化和国风插画创作的提示词案例。",
    icon: "brush",
    accent: "from-rose-400 to-violet-500",
  },
  {
    slug: "3d-icon",
    name: "3D 图标",
    description: "适合圆润立体图标、应用图标和轻量 3D 视觉资产的提示词案例。",
    icon: "box",
    accent: "from-indigo-500 to-purple-500",
  },
  {
    slug: "ui-design",
    name: "UI 设计",
    description: "适合 App、网页、组件系统、仪表盘和界面概念设计的提示词案例。",
    icon: "layout",
    accent: "from-cyan-500 to-violet-500",
  },
  {
    slug: "game-concept",
    name: "游戏概念图",
    description: "适合奇幻场景、科幻城市、世界观设定和游戏气氛图的提示词案例。",
    icon: "gamepad",
    accent: "from-sky-500 to-fuchsia-500",
  },
  {
    slug: "xiaohongshu-cover",
    name: "小红书封面",
    description: "适合生活方式封面、种草图、旅行封面和社交媒体首图的提示词案例。",
    icon: "cover",
    accent: "from-pink-500 to-violet-500",
  },
  {
    slug: "vintage-poster",
    name: "复古海报",
    description: "适合旅行海报、怀旧广告、复古电影和老派印刷质感的提示词案例。",
    icon: "ticket",
    accent: "from-amber-400 to-violet-500",
  },
  {
    slug: "character-design",
    name: "角色设定",
    description: "适合人物设定、角色卡、IP 形象和二次元角色视觉的提示词案例。",
    icon: "user-round",
    accent: "from-violet-500 to-pink-500",
  },
];

const quota = {
  portrait: 12,
  "product-poster": 17,
  "ecommerce-main-image": 16,
  "chinese-illustration": 8,
  "3d-icon": 5,
  "ui-design": 12,
  "game-concept": 8,
  "xiaohongshu-cover": 6,
  "vintage-poster": 8,
  "character-design": 8,
};

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

const phraseMap = [
  ["E-commerce Main Image", "电商主图"],
  ["Product Studio Shot", "产品棚拍"],
  ["Commercial Marketing Photograph", "商业营销摄影"],
  ["Product Photography", "产品摄影"],
  ["Luxury Amber Perfume", "琥珀香水"],
  ["Skincare Product", "护肤品"],
  ["Tropical Citrus Soda", "热带柑橘汽水"],
  ["Industrial Design Presentation", "工业设计展示"],
  ["Luxury Chronograph Watch", "高级计时腕表"],
  ["Perfume Shot on Moss", "苔藓香水"],
  ["Chocolate Campaign", "巧克力广告"],
  ["Fruit Juice", "果汁"],
  ["Convenience Store Neon", "便利店霓虹"],
  ["Cinematic Minimal", "极简电影感"],
  ["Japanese Onsen Ryokan", "日式温泉旅馆"],
  ["35mm Flash Editorial", "35mm 闪光灯杂志"],
  ["Mirror Selfie", "镜面自拍"],
  ["Soft Airy", "柔光空气感"],
  ["Luxury Glam Beauty", "高级美妆"],
  ["Cosplayer", "Cosplay"],
  ["Street Portrait", "街头人像"],
  ["Korean Idol", "韩系偶像"],
  ["Cyberpunk", "赛博朋克"],
  ["Portrait", "人像"],
  ["Headshot", "头像"],
  ["Brand Identity", "品牌识别"],
  ["Merch Board", "周边设定板"],
  ["Mascot", "吉祥物"],
  ["Food Delivery Flyer", "外卖传单"],
  ["Room Goods Poster", "家居周边海报"],
  ["Seed Packet Diorama", "种子包装立体场景"],
  ["Sneaker Poster", "运动鞋海报"],
  ["Streetwear", "街头服饰"],
  ["Miniature", "微缩"],
  ["VR Headset", "VR 头显"],
  ["Exploded View", "爆炸图"],
  ["Ad Poster", "广告海报"],
  ["Campaign", "广告大片"],
  ["One-Prompt UI Design", "一键 UI 设计"],
  ["Design System", "设计系统"],
  ["Social Media Feed", "社交媒体信息流"],
  ["Livestream", "直播界面"],
  ["Dashboard", "仪表盘"],
  ["Landing Page", "落地页"],
  ["Game Screen", "游戏界面"],
  ["Character Reference Card", "角色设定卡"],
  ["Character Introduction Page", "角色介绍页"],
  ["Character Sheet", "角色设定稿"],
  ["Mecha Girl", "机甲少女"],
  ["Anime Martial Arts", "动漫武侠"],
  ["Game Concept", "游戏概念"],
  ["City Poster", "城市海报"],
  ["Travel Poster", "旅行海报"],
  ["Food Map", "美食地图"],
  ["Chinese Minimalist", "中式极简"],
  ["Ink-Curve", "水墨曲线"],
  ["Ink", "水墨"],
  ["Wuxia", "武侠"],
  ["Journey to the West", "西游记"],
  ["Dark-Fantasy", "暗黑幻想"],
  ["Science Fiction", "科幻"],
  ["Vintage", "复古"],
  ["Movie Poster", "电影海报"],
  ["Fashion Cover", "时尚封面"],
  ["Magazine Cover", "杂志封面"],
  ["Infographic", "信息图"],
  ["Storyboard", "分镜板"],
  ["Illustration", "插画"],
  ["Poster", "海报"],
  ["UI", "UI"],
  ["App", "App"],
  ["Web", "Web"],
  ["3D", "3D"],
  ["Icon", "图标"],
];

const categoryTagMap = {
  portrait: ["人像", "摄影", "写真"],
  "product-poster": ["产品", "海报", "广告"],
  "ecommerce-main-image": ["电商", "主图", "产品"],
  "chinese-illustration": ["国风", "插画", "东方美学"],
  "3d-icon": ["3D", "图标", "拟物"],
  "ui-design": ["UI", "界面", "App"],
  "game-concept": ["游戏", "场景", "概念图"],
  "xiaohongshu-cover": ["小红书", "封面", "生活方式"],
  "vintage-poster": ["复古", "海报", "印刷感"],
  "character-design": ["角色", "设定", "二次元"],
};

const keywordTags = [
  ["portrait|headshot|selfie|idol|beauty|photo|photograph", "人像"],
  ["cinematic|movie|film", "电影感"],
  ["soft|airy|natural", "柔光"],
  ["neon|cyberpunk", "霓虹"],
  ["product|perfume|cosmetic|skincare|watch|shoe|sneaker|food|beverage|juice|soda|chocolate", "产品"],
  ["e-commerce|ecommerce|main image|listing|hero image", "电商"],
  ["poster|flyer|ad|advertisement|campaign", "海报"],
  ["luxury|premium", "高级"],
  ["minimal|minimalist", "极简"],
  ["chinese|ink|oriental|wuxia|hanfu|journey to the west|taoist|guangzhou|chengdu", "国风"],
  ["city|travel|map", "城市"],
  ["vintage|retro|90s|old", "复古"],
  ["ui|interface|dashboard|web|app|landing|screen|feed", "UI"],
  ["3d|icon|clay|isometric|diorama|miniature|exploded view", "3D"],
  ["character|mascot|anime|persona|gal game|mecha", "角色"],
  ["game|concept|fantasy|sci-fi|science fiction|world", "游戏"],
  ["cover|thumbnail|social|livestream|grwm", "封面"],
  ["fashion|editorial|magazine", "杂志感"],
  ["packaging|brand identity|logo", "包装"],
];

function ensureSourceRepo() {
  if (fs.existsSync(path.join(sourceRoot, ".git"))) {
    execFileSync("git", ["-C", sourceRoot, "fetch", "--depth", "1", "origin", "main"], { stdio: "ignore" });
    execFileSync("git", ["-C", sourceRoot, "checkout", "FETCH_HEAD"], { stdio: "ignore" });
    return;
  }

  if (fs.existsSync(sourceRoot)) fs.rmSync(sourceRoot, { recursive: true, force: true });
  execFileSync("git", ["clone", "--depth", "1", repoUrl, sourceRoot], { stdio: "inherit" });
}

function backupFile(fileName, suffix) {
  const source = path.join(dataDir, fileName);
  if (!fs.existsSync(source)) return undefined;
  const baseName = fileName.replace(".json", `.${suffix}.json`);
  const target = path.join(dataDir, baseName);
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    return target;
  }
  return target;
}

function parseCases(file) {
  const markdown = fs.readFileSync(path.join(sourceRoot, "cases", file), "utf8");
  const matches = Array.from(markdown.matchAll(/^### Case (\d+):.*$/gm));
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(start, end);
    const heading = match[0];
    const caseId = Number(match[1]);
    const title = heading.match(/\[([^\]]+)\]\(/)?.[1] ?? `Case ${caseId}`;
    const originalSourceUrl = heading.match(/\]\((https?:\/\/[^)]+)\)/)?.[1];
    const images = Array.from(block.matchAll(/<img[^>]+src="([^"]+)"/g), (item) => normalizeImageUrl(item[1]));
    const prompt =
      block.match(/\*\*Prompt:\*\*\s*```([\s\S]*?)```/i)?.[1]?.trim() ??
      block.match(/\*\*Prompt:\*\*\s*([\s\S]*?)(?=\n### Case|\n---|$)/i)?.[1]?.replace(/```/g, "").trim() ??
      "";

    return {
      file,
      caseId,
      originalTitle: title,
      originalSourceUrl,
      images,
      prompt: prompt.replace(/\r\n/g, "\n"),
    };
  });
}

function normalizeImageUrl(value) {
  if (value.startsWith("http")) return value;
  const clean = value.replace(/^(\.\/|\.\.\/)+/, "");
  return `https://raw.githubusercontent.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts/main/${clean}`;
}

function classifyCase(item) {
  const title = item.originalTitle.toLowerCase();
  const file = item.file;

  if (/3d|icon|clay|isometric|diorama|miniature|exploded view|stone staircase/.test(title)) return "3d-icon";
  if (/ui|interface|dashboard|app|web|landing page|design system|screen|feed|livestream|mockup/.test(title)) return "ui-design";
  if (/character|mascot|anime|persona|gal game|mecha|saint seiya|vtuber/.test(title)) return "character-design";
  if (/game|concept|fantasy|sci-fi|science fiction|cyberpunk|world|battle|gta|minecraft/.test(title)) return "game-concept";
  if (/vintage|retro|90s|old|super famicom|classic|film poster/.test(title)) return "vintage-poster";
  if (/xiaohongshu|social|cover|thumbnail|grwm|lifestyle|magazine|fashion cover/.test(title)) return "xiaohongshu-cover";
  if (/chinese|ink|oriental|hanfu|guofeng|wuxia|journey to the west|taoist|guangzhou|chengdu|shan|calligraphy|song dynasty/.test(title)) {
    return "chinese-illustration";
  }
  if (file === "portrait.md" && /portrait|selfie|idol|beauty|photo|photograph|snapshot|mother|family/.test(title)) return "portrait";
  if (file === "ecommerce.md") return "ecommerce-main-image";
  if (/product|perfume|cosmetic|skincare|watch|shoe|sneaker|food|beverage|juice|soda|chocolate|ad|advertisement|campaign|poster|flyer/.test(title)) {
    return "product-poster";
  }
  if (file === "character.md") return "character-design";
  if (file === "poster.md") return "product-poster";
  return undefined;
}

function makeSlug(item, categorySlug) {
  if (item.file === "portrait.md" && item.caseId === 1) return "neon-cinematic-portrait";
  const fileSlug = item.file.replace(".md", "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const titleSlug = item.originalTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 8)
    .join("-");
  return `${categorySlug}-${fileSlug}-${item.caseId}-${titleSlug}`.replace(/-+/g, "-");
}

function zhTitle(originalTitle, categorySlug) {
  let title = originalTitle.replace(/^E-commerce Main Image\s*-\s*/i, "").replace(/\bPrompt\b/gi, "").trim();
  for (const [en, zh] of phraseMap) {
    title = title.replace(new RegExp(escapeRegExp(en), "gi"), zh);
  }
  title = title.replace(/\s*[-:]\s*/g, " ").replace(/\s+/g, " ").trim();
  const asciiCount = (title.match(/[a-z]/gi) ?? []).length;
  if (asciiCount > 14) return naturalFallbackTitle(originalTitle, categorySlug);
  return title || naturalFallbackTitle(originalTitle, categorySlug);
}

function naturalFallbackTitle(originalTitle, categorySlug) {
  const title = originalTitle.toLowerCase();
  if (title.includes("mustang") || title.includes("car")) return "跑车生活方式封面";
  if (title.includes("momos") || title.includes("burger") || title.includes("food")) return "电影感美食广告";
  if (title.includes("beverage") || title.includes("watermelon") || title.includes("drink")) return "清爽饮品广告海报";
  if (title.includes("perfume")) return "极简香水产品海报";
  if (title.includes("skincare") || title.includes("cosmetic") || title.includes("beauty")) return "自然光美妆封面";
  if (title.includes("watch")) return "高级腕表广告海报";
  if (title.includes("sneaker") || title.includes("shoe") || title.includes("loafer")) return "鞋履商品种草图";
  if (title.includes("dashboard")) return "数据看板 UI 概念";
  if (title.includes("livestream") || title.includes("live stream")) return "直播界面 UI";
  if (title.includes("app")) return "App 界面设计概念";
  if (title.includes("vtuber")) return "VTuber 角色封面";
  if (title.includes("asmr")) return "ASMR 少女角色设定";
  if (title.includes("anime")) return "二次元角色设定";
  if (title.includes("hanfu")) return "博物馆汉服拆解图";
  if (title.includes("calligraphy")) return "书法字帖排版图";
  if (title.includes("newspaper")) return "复古报纸人物头版";
  if (title.includes("vintage")) return "复古印刷海报";
  if (title.includes("pixel")) return "像素游戏概念板";
  if (title.includes("shinjuku") || title.includes("bar")) return "新宿酒吧游戏场景";
  if (title.includes("market")) return "市集开放世界场景";
  if (title.includes("portrait")) return "电影感人像写真";
  if (title.includes("icon") || title.includes("chibi") || title.includes("3d")) return "圆润 3D 视觉资产";

  return {
    portrait: "电影感人像写真",
    "product-poster": "高级产品广告海报",
    "ecommerce-main-image": "精致商品电商主图",
    "chinese-illustration": "东方美学国风插画",
    "3d-icon": "圆润 3D 图标套装",
    "ui-design": "现代产品界面设计",
    "game-concept": "幻想游戏概念场景",
    "xiaohongshu-cover": "生活方式种草封面",
    "vintage-poster": "复古印刷风海报",
    "character-design": "二次元角色设定",
  }[categorySlug] ?? "精选视觉提示词";
}

// Kept as a legacy reference for older import batches; current imports use naturalFallbackTitle.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fallbackTitle(originalTitle, categorySlug, caseId) {
  const title = originalTitle.toLowerCase();
  if (title.includes("perfume")) return "高级香水产品海报";
  if (title.includes("skincare") || title.includes("cosmetic")) return "柔光护肤品主图";
  if (title.includes("watch")) return "高级腕表广告海报";
  if (title.includes("sneaker") || title.includes("shoe")) return "运动鞋产品海报";
  if (title.includes("food") || title.includes("recipe")) return "美食广告海报";
  if (title.includes("travel")) return "复古旅行海报";
  if (title.includes("city")) return "城市主题视觉海报";
  if (title.includes("character")) return "角色设定视觉稿";
  if (title.includes("dashboard")) return "数据看板 UI 概念";
  if (title.includes("app")) return "App 界面设计概念";
  if (title.includes("portrait")) return "电影感人像写真";
  const category = categoryBySlug.get(categorySlug);
  return `${category?.name ?? "提示词"}案例 ${caseId}`;
}

function buildTags(item, categorySlug) {
  const title = item.originalTitle.toLowerCase();
  const tags = new Set(categoryTagMap[categorySlug] ?? []);
  for (const [pattern, tag] of keywordTags) {
    if (new RegExp(pattern, "i").test(title)) tags.add(tag);
  }
  return Array.from(tags).slice(0, 6);
}

function descriptionFor(title, categorySlug) {
  const descriptions = {
    portrait: `${title}，适合头像、写真和人物视觉参考。`,
    "product-poster": `${title}，适合品牌广告、产品宣传和商业海报参考。`,
    "ecommerce-main-image": `${title}，适合电商首图、商品展示和详情页视觉参考。`,
    "chinese-illustration": `${title}，适合国风插画、文旅海报和东方美学视觉参考。`,
    "3d-icon": `${title}，适合 3D 图标、拟物视觉和轻量资产设计参考。`,
    "ui-design": `${title}，适合 App、Web、仪表盘和设计系统灵感参考。`,
    "game-concept": `${title}，适合游戏场景、世界观设定和概念图参考。`,
    "xiaohongshu-cover": `${title}，适合小红书封面、社交媒体首图和生活方式内容参考。`,
    "vintage-poster": `${title}，适合复古海报、旅行视觉和怀旧印刷风格参考。`,
    "character-design": `${title}，适合角色设定、IP 形象和人物档案参考。`,
  };
  return descriptions[categorySlug] ?? `${title}，适合 AI 图片创作灵感参考。`;
}

function chinesePromptFor(title, categorySlug, tags) {
  const tagText = tags.join("、");
  const templates = {
    portrait: `生成一张${title}：人物主体清晰，表情自然，光线有层次，背景与人物气质统一，画面具有${tagText}风格，保留真实皮肤质感、电影感构图和高级摄影细节。`,
    "product-poster": `生成一张${title}：产品主体居中或略偏构图，材质细节清晰，使用高级商业光影、干净背景和明确留白，突出${tagText}氛围，适合品牌广告和宣传海报。`,
    "ecommerce-main-image": `生成一张${title}：商品主体完整清晰，背景干净，卖点表达明确，加入真实材质、柔和反射和商业摄影光线，突出${tagText}，适合电商主图和详情页首图。`,
    "chinese-illustration": `生成一张${title}：融合东方美学、留白、细腻线条和文化元素，画面层次清楚，色彩克制高级，突出${tagText}，适合文旅海报、国风插画和内容封面。`,
    "3d-icon": `生成一张${title}：使用圆润立体造型、干净浅色背景、柔和阴影和精致材质，主体完整不裁切，突出${tagText}，适合图标套装、应用视觉和 3D 资产展示。`,
    "ui-design": `生成一张${title}：展示清晰的信息架构、现代组件、卡片、按钮、导航和关键页面状态，使用统一设计系统和舒适留白，突出${tagText}，适合产品概念和界面提案。`,
    "game-concept": `生成一张${title}：构建具有故事感的场景空间，包含清晰前中后景、氛围光、角色或建筑线索，突出${tagText}，适合游戏世界观、概念设定和视觉开发。`,
    "xiaohongshu-cover": `生成一张${title}：画面干净醒目，主体与标题区域分明，色彩柔和适合移动端浏览，突出${tagText}，适合小红书封面、社交媒体首图和生活方式内容。`,
    "vintage-poster": `生成一张${title}：使用复古印刷质感、怀旧配色、清晰标题排版和海报式构图，突出${tagText}，适合旅行海报、电影海报和复古内容封面。`,
    "character-design": `生成一张${title}：角色形象完整，展示服装、表情、姿态和关键设定信息，版式清晰，突出${tagText}，适合角色卡、IP 设定和游戏人物展示。`,
  };
  return templates[categorySlug] ?? `生成一张${title}：构图清晰，主体明确，风格统一，细节丰富，适合 AI 图片创作参考。`;
}

function englishPromptFor(originalTitle, categorySlug, tags) {
  const tagText = tags.map(englishTag).join(", ");
  const category = englishCategory(categorySlug);
  return `Create a polished ${category} image concept inspired by "${originalTitle}". Focus on ${tagText}. Use a clear composition, refined lighting, high-quality details, coherent visual style, and professional commercial presentation. Keep the main subject readable, avoid clutter, and make the result suitable for an AI image prompt library showcase.`;
}

function englishCategory(categorySlug) {
  return {
    portrait: "portrait photography",
    "product-poster": "product advertising poster",
    "ecommerce-main-image": "e-commerce product hero image",
    "chinese-illustration": "Chinese-style illustration",
    "3d-icon": "3D icon visual",
    "ui-design": "UI design presentation",
    "game-concept": "game concept art",
    "xiaohongshu-cover": "social media cover",
    "vintage-poster": "vintage poster",
    "character-design": "character design sheet",
  }[categorySlug] ?? "visual concept";
}

function englishTag(tag) {
  return {
    人像: "portrait",
    摄影: "photography",
    写真: "photo shoot",
    头像: "avatar",
    封面: "cover",
    产品: "product",
    海报: "poster",
    广告: "advertising",
    电商: "e-commerce",
    主图: "hero image",
    包装: "packaging",
    香水: "perfume",
    护肤品: "skincare",
    美食: "food",
    极简: "minimal",
    复古: "vintage",
    国风: "Chinese style",
    水墨: "ink wash",
    插画: "illustration",
    地图: "map",
    城市: "city",
    "3D": "3D",
    图标: "icon",
    拟物: "skeuomorphic",
    UI: "UI",
    App: "app",
    Web: "web",
    仪表盘: "dashboard",
    角色: "character",
    二次元: "anime",
    游戏: "game",
    科幻: "science fiction",
    奇幻: "fantasy",
    场景: "scene",
    赛博朋克: "cyberpunk",
    小红书: "lifestyle social media",
    生活方式: "lifestyle",
    旅行: "travel",
    东方美学: "oriental aesthetics",
    电影感: "cinematic",
    霓虹: "neon",
    柔光: "soft light",
    杂志感: "editorial",
    高级: "premium",
    科技: "technology",
    数据: "data",
    设定: "concept sheet",
    界面: "interface",
    设计系统: "design system",
    组件: "components",
    印刷感: "print texture",
  }[tag] ?? "visual design";
}

function isEnglishPrompt(value) {
  return value && !/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(value);
}

function isDisplaySafePrompt(value) {
  return !/\b(sexy|seductive|cleavage|mini skirt|parted lips|temptation|barefoot|vulnerable|aroused|nsfw)\b/i.test(value);
}

function ratioFor(categorySlug) {
  return {
    portrait: "4:5",
    "product-poster": "4:5",
    "ecommerce-main-image": "1:1",
    "chinese-illustration": "3:4",
    "3d-icon": "1:1",
    "ui-design": "16:10",
    "game-concept": "16:9",
    "xiaohongshu-cover": "4:5",
    "vintage-poster": "3:4",
    "character-design": "3:4",
  }[categorySlug] ?? "4:3";
}

function imageFitFor(categorySlug) {
  return ["product-poster", "ecommerce-main-image", "3d-icon", "ui-design", "xiaohongshu-cover", "vintage-poster", "character-design"].includes(
    categorySlug,
  )
    ? "contain"
    : "cover";
}

function displayTypeFor(categorySlug) {
  return {
    portrait: "portrait",
    "product-poster": "poster",
    "ecommerce-main-image": "product",
    "chinese-illustration": "poster",
    "3d-icon": "icon",
    "ui-design": "ui",
    "game-concept": "scene",
    "xiaohongshu-cover": "poster",
    "vintage-poster": "poster",
    "character-design": "portrait",
  }[categorySlug];
}

function buildPrompt(item, index) {
  const categorySlug = item.categorySlug;
  const category = categoryBySlug.get(categorySlug);
  const title = zhTitle(item.originalTitle, categorySlug);
  const tags = buildTags(item, categorySlug);
  const englishPrompt =
    isEnglishPrompt(item.prompt) && isDisplaySafePrompt(item.prompt) ? item.prompt : englishPromptFor(item.originalTitle, categorySlug, tags);
  const chinesePrompt = chinesePromptFor(title, categorySlug, tags);
  const slug = makeSlug(item, categorySlug);
  const createdAt = new Date(Date.UTC(2026, 4, 12, 9, index, 0)).toISOString();
  const likes = 86 + ((index * 37 + item.caseId) % 920);
  const views = 980 + ((index * 211 + item.caseId * 13) % 9800);

  return {
    id: `real-${item.file.replace(".md", "")}-${item.caseId}`,
    title,
    slug,
    category: category.name,
    categoryName: category.name,
    categorySlug,
    tags,
    coverImage: item.images[0],
    image: item.images[0],
    imageUrl: item.images[0],
    galleryImages: item.images,
    imageFit: imageFitFor(categorySlug),
    displayType: displayTypeFor(categorySlug),
    englishPrompt,
    enPrompt: englishPrompt,
    chinesePrompt,
    cnPrompt: chinesePrompt,
    zhPrompt: chinesePrompt,
    description: descriptionFor(title, categorySlug),
    sourceName: repoName,
    sourceUrl: `https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts/blob/main/cases/${item.file}`,
    originalSourceUrl: item.originalSourceUrl,
    aspectRatio: ratioFor(categorySlug),
    ratio: ratioFor(categorySlug),
    model: "GPT Image 2",
    style: styleFor(categorySlug, tags),
    useCases: casesForPrompt(categorySlug),
    useCase: casesForPrompt(categorySlug).join("、"),
    views,
    favorites: likes,
    likes,
    createdAt,
    updatedAt: createdAt,
    isFeatured: index < 8,
  };
}

function styleFor(categorySlug, tags) {
  if (tags.includes("复古")) return "复古印刷风";
  if (tags.includes("赛博朋克")) return "赛博朋克";
  if (tags.includes("国风")) return "东方美学";
  if (tags.includes("极简")) return "极简高级感";
  return {
    portrait: "电影感摄影",
    "product-poster": "商业广告摄影",
    "ecommerce-main-image": "电商产品摄影",
    "chinese-illustration": "国风插画",
    "3d-icon": "圆润 3D",
    "ui-design": "现代 UI",
    "game-concept": "游戏概念艺术",
    "xiaohongshu-cover": "生活方式封面",
    "vintage-poster": "复古海报",
    "character-design": "角色设定",
  }[categorySlug];
}

function casesForPrompt(categorySlug) {
  return {
    portrait: ["头像", "写真", "社交媒体封面"],
    "product-poster": ["产品海报", "品牌广告", "社交媒体推广"],
    "ecommerce-main-image": ["电商主图", "商品详情页", "卖点展示"],
    "chinese-illustration": ["文旅海报", "国风插画", "内容封面"],
    "3d-icon": ["图标套装", "App 视觉", "品牌素材"],
    "ui-design": ["App 概念", "Web 界面", "产品提案"],
    "game-concept": ["游戏场景", "世界观设定", "概念海报"],
    "xiaohongshu-cover": ["小红书封面", "社交媒体首图", "生活方式内容"],
    "vintage-poster": ["复古海报", "旅行宣传", "怀旧封面"],
    "character-design": ["角色设定", "IP 形象", "游戏人物"],
  }[categorySlug];
}

function syncCategories(prompts) {
  return categories.map((category, index) => {
    const items = prompts.filter((prompt) => prompt.categorySlug === category.slug);
    const top = [...items].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))[0];
    const tagCounts = new Map();
    for (const item of items) {
      for (const tag of item.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    const tags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);

    return {
      id: `cat-${String(index + 1).padStart(2, "0")}`,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      accent: category.accent,
      coverImage: top?.coverImage ?? "",
      thumbnail: top?.coverImage ?? "",
      accentImage: top?.coverImage ?? "",
      dailyImageMode: "top-prompt",
      promptCount: items.length,
      count: items.length,
      tags,
    };
  });
}

function syncTags(prompts) {
  const names = Array.from(new Set(prompts.flatMap((prompt) => prompt.tags)));
  return names.sort((a, b) => a.localeCompare(b, "zh-Hans-CN")).map((name, index) => ({
    id: `tag-${String(index + 1).padStart(2, "0")}`,
    name,
    slug: tagSlug(name),
    description: `${name}相关提示词标签`,
  }));
}

function tagSlug(name) {
  const known = {
    人像: "portrait",
    摄影: "photography",
    写真: "photo-shoot",
    头像: "avatar",
    封面: "cover",
    产品: "product",
    海报: "poster",
    广告: "advertising",
    电商: "ecommerce",
    主图: "main-image",
    包装: "packaging",
    香水: "perfume",
    护肤品: "skincare",
    美食: "food",
    极简: "minimal",
    复古: "vintage",
    国风: "chinese-style",
    国潮: "china-chic",
    水墨: "ink",
    插画: "illustration",
    地图: "map",
    城市: "city",
    "3D": "3d",
    图标: "icon",
    拟物: "skeuomorphic",
    UI: "ui",
    App: "app",
    Web: "web",
    仪表盘: "dashboard",
    角色: "character",
    IP: "ip",
    二次元: "anime",
    游戏: "game",
    科幻: "sci-fi",
    奇幻: "fantasy",
    场景: "scene",
    赛博朋克: "cyberpunk",
    小红书: "xiaohongshu",
    生活方式: "lifestyle",
    旅行: "travel",
    东方美学: "oriental-aesthetic",
  };
  return known[name] ?? name.toLowerCase().replace(/\s+/g, "-");
}

function writeJson(fileName, value) {
  fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function imageAvailable(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { method: "HEAD", signal: controller.signal });
    return response.ok;
  } catch {
    try {
      const response = await fetch(url, { method: "GET", signal: controller.signal });
      return response.ok;
    } catch {
      return false;
    }
  } finally {
    clearTimeout(timer);
  }
}

async function selectCases(allCases) {
  const byCategory = new Map();
  for (const item of allCases) {
    const categorySlug = classifyCase(item);
    if (!categorySlug || !item.images.length || !item.prompt) continue;
    if (!byCategory.has(categorySlug)) byCategory.set(categorySlug, []);
    byCategory.get(categorySlug).push({ ...item, categorySlug });
  }

  const selected = [];
  const used = new Set();
  const skippedImages = [];

  async function tryAdd(item) {
    const key = `${item.file}:${item.caseId}`;
    if (used.has(key)) return false;
    const ok = await imageAvailable(item.images[0]);
    if (!ok) {
      skippedImages.push(key);
      return false;
    }
    used.add(key);
    selected.push(item);
    return true;
  }

  for (const [categorySlug, count] of Object.entries(quota)) {
    const items = byCategory.get(categorySlug) ?? [];
    let added = 0;
    for (const item of items) {
      if (added >= count) break;
      if (await tryAdd(item)) added += 1;
    }
  }

  if (selected.length < targetCount) {
    const leftovers = Array.from(byCategory.values()).flat();
    for (const item of leftovers) {
      if (selected.length >= targetCount) break;
      await tryAdd(item);
    }
  }

  if (selected.length < targetCount) {
    throw new Error(`Only selected ${selected.length} valid cases; target is ${targetCount}. Skipped bad images: ${skippedImages.join(", ")}`);
  }

  return { selected: selected.slice(0, targetCount), skippedImages };
}

async function main() {
  ensureSourceRepo();
  backupFile("prompts.json", "real.20.backup");
  backupFile("categories.json", "real.20.backup");
  backupFile("tags.json", "real.20.backup");

  const allCases = sourceFiles.flatMap(parseCases);
  const { selected, skippedImages } = await selectCases(allCases);
  const prompts = selected.map(buildPrompt);
  const nextCategories = syncCategories(prompts);
  const nextTags = syncTags(prompts);

  writeJson("prompts.json", prompts);
  writeJson("categories.json", nextCategories);
  writeJson("tags.json", nextTags);

  const distribution = nextCategories.map((category) => `${category.name}: ${category.count}`).join("\n");
  console.log(`Imported ${prompts.length} prompts from ${repoName}.`);
  console.log(distribution);
  if (skippedImages.length) console.log(`Skipped unavailable images: ${skippedImages.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
