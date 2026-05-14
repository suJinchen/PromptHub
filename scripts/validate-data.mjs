import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const prompts = readJson("src/data/prompts.json");
const categories = readJson("src/data/categories.json");
const tags = readJson("src/data/tags.json");
const expectedCount = Number(process.env.PROMPTHUB_EXPECTED_COUNT || 100);

const errors = [];
const warnings = [];
const badTextPattern = /\?\?\?|undefined|null|Sparkles/;
const badNumberTextPattern = /(^|[^a-z])NaN($|[^a-z])/i;
const numberedDisplayPattern = /案例\s*\d+|case\s*\d+|demo\s*\d+|prompt\s*\d+/i;
const chinesePattern = /[\u4e00-\u9fff]/;
const cjkPattern = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;
const unsafePromptPattern = /\b(sexy|seductive|cleavage|mini skirt|parted lips|temptation|aroused|nsfw)\b/i;
const categorySlugs = new Set(categories.map((item) => item.slug));
const tagNames = new Set(tags.map((item) => item.name));
const slugs = new Set();
const categoryCounts = new Map();
const ratioLabels = new Set();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function valueOf(prompt, keys) {
  for (const key of keys) {
    const value = prompt[key];
    if (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return undefined;
}

function checkText(owner, field, value) {
  if (typeof value !== "string") return;
  if (badTextPattern.test(value) || badNumberTextPattern.test(value) || value.includes("\uFFFD")) {
    errors.push(`${owner}: ${field} contains invalid text: ${value.slice(0, 100)}`);
  }
}

function checkDisplayText(owner, field, value) {
  checkText(owner, field, value);
  if (typeof value !== "string") return;
  if (!value.trim()) errors.push(`${owner}: ${field} is empty`);
  if (numberedDisplayPattern.test(value)) errors.push(`${owner}: ${field} contains generated numbering: ${value.slice(0, 100)}`);
  if (field === "title" && Array.from(value.trim()).length > 24) {
    warnings.push(`${owner}: title is longer than 24 characters`);
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function imageAvailable(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const head = await fetchWithTimeout(url, { method: "HEAD", cache: "no-store" });
      if (head.ok) return true;
    } catch {
      // Try a small GET below; GitHub raw URLs can be flaky for repeated HEAD requests.
    }

    try {
      const get = await fetchWithTimeout(url, { method: "GET", headers: { Range: "bytes=0-1023" }, cache: "no-store" });
      if (get.ok || get.status === 206) return true;
    } catch {
      // Retry with a fresh AbortController on the next loop.
    }
  }
  return false;
}

if (prompts.length !== expectedCount) {
  errors.push(`expected ${expectedCount} prompts, got ${prompts.length}`);
}

for (const prompt of prompts) {
  const slug = prompt.slug;
  if (!slug) errors.push("prompt missing slug");
  if (slugs.has(slug)) errors.push(`${slug}: duplicate slug`);
  slugs.add(slug);

  const required = {
    id: ["id"],
    title: ["title"],
    description: ["description"],
    category: ["category", "categoryName"],
    categorySlug: ["categorySlug"],
    image: ["coverImage", "image", "imageUrl"],
    galleryImages: ["galleryImages"],
    chinesePrompt: ["chinesePrompt", "cnPrompt", "zhPrompt"],
    englishPrompt: ["englishPrompt", "enPrompt"],
    model: ["model"],
    ratio: ["ratio", "aspectRatio"],
    style: ["style"],
    useCase: ["useCase", "useCases"],
    views: ["views"],
    likes: ["likes", "favorites"],
    sourceName: ["sourceName"],
    sourceUrl: ["sourceUrl"],
    imageFit: ["imageFit", "displayType"],
    imageWidth: ["imageWidth"],
    imageHeight: ["imageHeight"],
    aspectRatioLabel: ["aspectRatioLabel"],
  };

  for (const [name, keys] of Object.entries(required)) {
    if (valueOf(prompt, keys) === undefined) errors.push(`${slug}: missing ${name}`);
  }

  if (!categorySlugs.has(prompt.categorySlug)) errors.push(`${slug}: unknown categorySlug ${prompt.categorySlug}`);
  categoryCounts.set(prompt.categorySlug, (categoryCounts.get(prompt.categorySlug) ?? 0) + 1);

  if (!Array.isArray(prompt.tags) || prompt.tags.length === 0) {
    errors.push(`${slug}: tags must be a non-empty array`);
  } else {
    for (const tag of prompt.tags) {
      if (!tagNames.has(tag)) errors.push(`${slug}: tag not listed in tags.json: ${tag}`);
      checkText(slug, "tag", tag);
    }
  }

  const textFields = [
    "title",
    "description",
    "category",
    "categoryName",
    "chinesePrompt",
    "cnPrompt",
    "zhPrompt",
    "englishPrompt",
    "enPrompt",
    "sourceUrl",
    "sourceName",
    "style",
    "useCase",
  ];

  for (const field of textFields) checkText(slug, field, prompt[field]);
  checkDisplayText(slug, "title", prompt.title);
  checkDisplayText(slug, "description", prompt.description);

  const englishPrompt = prompt.englishPrompt || prompt.enPrompt || "";
  const chinesePrompt = prompt.chinesePrompt || prompt.cnPrompt || prompt.zhPrompt || "";
  if (typeof prompt.imageWidth !== "number" || prompt.imageWidth <= 0) errors.push(`${slug}: imageWidth must be a positive number`);
  if (typeof prompt.imageHeight !== "number" || prompt.imageHeight <= 0) errors.push(`${slug}: imageHeight must be a positive number`);
  if (typeof prompt.aspectRatioLabel === "string" && prompt.aspectRatioLabel.trim()) ratioLabels.add(prompt.aspectRatioLabel);
  if (cjkPattern.test(englishPrompt)) errors.push(`${slug}: English prompt contains CJK characters`);
  if (!chinesePattern.test(chinesePrompt)) errors.push(`${slug}: Chinese prompt does not contain Chinese characters`);
  if (englishPrompt.trim() === chinesePrompt.trim()) errors.push(`${slug}: Chinese prompt equals English prompt`);
  if (unsafePromptPattern.test(englishPrompt)) warnings.push(`${slug}: English prompt contains a sensitive display term`);
}

for (const category of categories) {
  checkText(category.slug, "category.name", category.name);
  checkText(category.slug, "category.description", category.description);
  for (const tag of category.tags ?? []) checkText(category.slug, "category.tag", tag);

  const actual = categoryCounts.get(category.slug) ?? 0;
  const declared = category.count ?? category.promptCount ?? 0;
  if (declared !== actual) errors.push(`${category.slug}: category count mismatch, declared ${declared}, actual ${actual}`);
  if (actual > 0 && !category.coverImage) errors.push(`${category.slug}: missing coverImage for non-empty category`);
}

for (const tag of tags) {
  checkText(tag.slug, "tag.name", tag.name);
  checkText(tag.slug, "tag.description", tag.description);
}

if (ratioLabels.size <= 1) errors.push(`aspectRatioLabel values are not diverse enough: ${Array.from(ratioLabels).join(", ") || "none"}`);

if (!errors.length) {
  let checked = 0;
  for (const prompt of prompts) {
    checked += 1;
    if (!(await imageAvailable(prompt.coverImage))) {
      errors.push(`${prompt.slug}: coverImage is not reachable`);
    }
  }
  console.log(`Checked ${checked} cover images.`);
}

if (warnings.length) {
  console.log(`Data warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 40)) console.log(`- ${warning}`);
  if (warnings.length > 40) console.log(`...and ${warnings.length - 40} more`);
}

if (errors.length) {
  console.error(`Data validation failed (${errors.length}):`);
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more`);
  process.exit(1);
}

const distribution = categories.map((category) => `${category.name}: ${category.count ?? category.promptCount ?? 0}`).join(", ");
console.log(`Data validation passed: ${prompts.length} prompts, ${categories.length} categories, ${tags.length} tags.`);
console.log(`Category distribution: ${distribution}`);
