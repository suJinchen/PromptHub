import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const PROMPTS_FILE = path.join(DATA_DIR, "prompts.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const TAGS_FILE = path.join(DATA_DIR, "tags.json");
const EXPECTED_COUNT = process.env.PROMPTHUB_EXPECTED_COUNT ? Number(process.env.PROMPTHUB_EXPECTED_COUNT) : null;
const CHECK_REMOTE_IMAGES = process.env.PROMPTHUB_CHECK_REMOTE_IMAGES === "1";

const badTextPattern = /(\?\?\?|\bundefined\b|\bnull\b|\bNaN\b|Sparkles|\uFFFD)/i;
const numberedPattern = /(案例\s*\d+|case\s*\d+|demo\s*\d+|prompt\s*\d+)/i;
const cjkPattern = /[\u4e00-\u9fff]/;
const requiredPromptFields = [
  "id", "slug", "title", "description", "category", "categorySlug", "tags", "coverImage", "galleryImages",
  "chinesePrompt", "englishPrompt", "model", "ratio", "style", "useCases", "views", "favorites", "sourceName", "sourceUrl",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function fail(errors, message) {
  errors.push(message);
}

function warn(warnings, message) {
  warnings.push(message);
}

function textHasBadValue(value) {
  return typeof value === "string" && badTextPattern.test(value);
}

function collectTextValues(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectTextValues(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectTextValues(item, out));
  return out;
}

async function headOk(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) return true;
    const get = await fetch(url, { method: "GET", signal: AbortSignal.timeout(8000) });
    return get.ok;
  } catch {
    return false;
  }
}

async function main() {
  const errors = [];
  const warnings = [];
  const prompts = readJson(PROMPTS_FILE);
  const categories = readJson(CATEGORIES_FILE);
  const tags = readJson(TAGS_FILE);

  if (!Array.isArray(prompts)) fail(errors, "prompts.json 必须是数组");
  if (!Array.isArray(categories)) fail(errors, "categories.json 必须是数组");
  if (!Array.isArray(tags)) fail(errors, "tags.json 必须是数组");
  if (EXPECTED_COUNT && prompts.length !== EXPECTED_COUNT) fail(errors, `prompts 数量应为 ${EXPECTED_COUNT}，当前为 ${prompts.length}`);
  if (!EXPECTED_COUNT && prompts.length === 0) fail(errors, "prompts 不能为空");

  const categorySlugs = new Set(categories.map((cat) => cat.slug));
  const tagNames = new Set(tags.map((tag) => (typeof tag === "string" ? tag : tag.name)).filter(Boolean));
  const seenSlugs = new Set();
  const categoryCounts = new Map();
  const ratioLabels = new Set();
  const imageUrls = [];

  for (const [index, prompt] of prompts.entries()) {
    const label = prompt.slug || prompt.id || `#${index}`;
    for (const field of requiredPromptFields) {
      if (prompt[field] === undefined || prompt[field] === null || prompt[field] === "" || (Array.isArray(prompt[field]) && prompt[field].length === 0)) {
        fail(errors, `${label} 缺少必填字段：${field}`);
      }
    }

    if (seenSlugs.has(prompt.slug)) fail(errors, `slug 重复：${prompt.slug}`);
    seenSlugs.add(prompt.slug);

    if (!categorySlugs.has(prompt.categorySlug)) fail(errors, `${label} 的 categorySlug 不存在：${prompt.categorySlug}`);
    categoryCounts.set(prompt.categorySlug, (categoryCounts.get(prompt.categorySlug) || 0) + 1);

    if (!Array.isArray(prompt.tags) || prompt.tags.length === 0) fail(errors, `${label} tags 不能为空`);
    for (const tag of prompt.tags || []) {
      if (!tagNames.has(tag)) fail(errors, `${label} 使用了 tags.json 中不存在的标签：${tag}`);
    }

    if (numberedPattern.test(prompt.title || "")) fail(errors, `${label} title 含无意义编号：${prompt.title}`);
    if (numberedPattern.test(prompt.description || "")) fail(errors, `${label} description 含无意义编号：${prompt.description}`);
    if ((prompt.title || "").length > 28) warn(warnings, `${label} title 偏长：${prompt.title}`);

    for (const text of collectTextValues(prompt)) {
      if (textHasBadValue(text)) fail(errors, `${label} 含异常文本：${text.slice(0, 80)}`);
    }

    if (cjkPattern.test(prompt.englishPrompt || "")) fail(errors, `${label} englishPrompt 混入中文字符`);
    if (!prompt.chinesePrompt || prompt.chinesePrompt === prompt.englishPrompt) fail(errors, `${label} chinesePrompt 为空或等于英文 Prompt`);

    if (!Number.isFinite(Number(prompt.imageWidth)) || Number(prompt.imageWidth) <= 0) fail(errors, `${label} imageWidth 无效`);
    if (!Number.isFinite(Number(prompt.imageHeight)) || Number(prompt.imageHeight) <= 0) fail(errors, `${label} imageHeight 无效`);
    if (!prompt.aspectRatioLabel) fail(errors, `${label} 缺少 aspectRatioLabel`);
    else ratioLabels.add(prompt.aspectRatioLabel);

    if (!prompt.sourceName || !prompt.sourceUrl) fail(errors, `${label} 缺少 sourceName/sourceUrl`);
    if (!prompt.sourceLicense && !prompt.license) warn(warnings, `${label} 缺少 sourceLicense/license`);
    if (prompt.coverImage) imageUrls.push(prompt.coverImage);
  }

  for (const category of categories) {
    const expected = categoryCounts.get(category.slug) || 0;
    if ((category.count ?? category.promptCount ?? 0) !== expected) fail(errors, `${category.name || category.slug} count=${category.count}，实际=${expected}`);
    if ((category.promptCount ?? category.count ?? 0) !== expected) fail(errors, `${category.name || category.slug} promptCount=${category.promptCount}，实际=${expected}`);
  }

  if (ratioLabels.size <= 3 && prompts.length > 20) warn(warnings, `比例标签种类偏少：${[...ratioLabels].join(", ")}`);

  if (CHECK_REMOTE_IMAGES) {
    const sample = imageUrls.slice(0, Math.min(imageUrls.length, 120));
    let failed = 0;
    for (const url of sample) {
      const ok = await headOk(url);
      if (!ok) { failed++; warn(warnings, `图片网络访问失败：${url}`); }
    }
    if (failed > Math.max(8, sample.length * 0.15)) fail(errors, `图片访问失败过多：${failed}/${sample.length}`);
  } else {
    warn(warnings, "未执行远程图片网络检查；如需检查请设置 PROMPTHUB_CHECK_REMOTE_IMAGES=1");
  }

  console.log(`PromptHub 数据校验：prompts=${prompts.length}, categories=${categories.length}, tags=${tags.length}, ratios=${ratioLabels.size}`);
  if (warnings.length) {
    console.log("\nWarnings:");
    warnings.slice(0, 80).forEach((item) => console.log(`- ${item}`));
    if (warnings.length > 80) console.log(`- 还有 ${warnings.length - 80} 条 warning 未展示`);
  }
  if (errors.length) {
    console.error("\nErrors:");
    errors.slice(0, 120).forEach((item) => console.error(`- ${item}`));
    if (errors.length > 120) console.error(`- 还有 ${errors.length - 120} 条 error 未展示`);
    process.exit(1);
  }
  console.log("\n数据校验通过。");
}

main();

