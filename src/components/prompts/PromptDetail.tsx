"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FAVORITE_CHANGE_EVENT, FavoriteButton, readFavorites } from "@/components/prompts/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/format";
import type { PromptItem } from "@/types/prompt";
import { CopyPromptButton } from "./CopyPromptButton";
import { ExpandablePromptBlock } from "./ExpandablePromptBlock";
import { PromptImage } from "./PromptImage";
import { RelatedPrompts } from "./RelatedPrompts";

type PromptDetailProps = { prompt: PromptItem; relatedPrompts: PromptItem[] };

function computedRatioLabel(prompt: PromptItem) {
  if (prompt.aspectRatioLabel) return prompt.aspectRatioLabel;
  if (prompt.imageWidth && prompt.imageHeight) {
    const ratio = prompt.imageWidth / prompt.imageHeight;
    return `约 ${ratio.toFixed(2)}:1`;
  }
  return prompt.aspectRatio || prompt.ratio || "自定义比例";
}

function getDisplayImages(prompt: PromptItem) {
  const images = prompt.galleryImages?.filter(Boolean).length ? prompt.galleryImages.filter(Boolean) : [prompt.coverImage].filter(Boolean);
  return Array.from(new Set(images));
}

export function PromptDetail({ prompt, relatedPrompts }: PromptDetailProps) {
  const tags = prompt.tags ?? [];
  const useCases = useMemo(() => (prompt.useCases?.length ? prompt.useCases : prompt.useCase ? [prompt.useCase] : []), [prompt.useCase, prompt.useCases]);
  const images = useMemo(() => getDisplayImages(prompt), [prompt]);
  const showThumbnails = images.length > 1;
  const [selectedImage, setSelectedImage] = useState(images[0] ?? prompt.coverImage ?? "");
  const title = prompt.title || "未命名提示词";
  const category = prompt.category || prompt.categoryName || "未分类";
  const chinesePrompt = prompt.chinesePrompt || prompt.cnPrompt || prompt.zhPrompt || "中文提示词待补充。";
  const englishPrompt = prompt.englishPrompt || prompt.enPrompt || "English prompt pending.";
  const model = prompt.model || "GPT Image 2";
  const ratio = computedRatioLabel(prompt);
  const style = prompt.style || "未指定";
  const sourceName = prompt.sourceName || prompt.sourceRepo || "公开资料";
  const sourceUrl = prompt.sourceUrl;
  const sourceLicense = prompt.sourceLicense || prompt.license || "未标注";
  const baseFavorites = prompt.favorites ?? prompt.likes ?? 0;
  const [favoriteCount, setFavoriteCount] = useState(baseFavorites);

  useEffect(() => {
    const syncFromStorage = () => setFavoriteCount(Math.max(0, baseFavorites + (readFavorites().has(prompt.slug) ? 1 : 0)));
    syncFromStorage();

    function handleFavoriteChange(event: Event) {
      const detail = (event as CustomEvent<{ slug: string; active: boolean }>).detail;
      if (detail?.slug === prompt.slug) syncFromStorage();
    }

    window.addEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(FAVORITE_CHANGE_EVENT, handleFavoriteChange);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [baseFavorites, prompt.slug]);

  const allText = useMemo(
    () =>
      [
        `标题：\n${title}`,
        `中文提示词：\n${chinesePrompt}`,
        `English Prompt:\n${englishPrompt}`,
        [`参数建议：`, `模型：${model}`, `比例：${ratio}`, `风格：${style}`, `适用场景：${useCases.join("、") || "未指定"}`].join("\n"),
      ].join("\n\n"),
    [chinesePrompt, englishPrompt, model, ratio, style, title, useCases],
  );

  const params = [
    { label: "模型", value: model },
    { label: "比例", value: ratio },
    { label: "风格", value: style },
    { label: "适用场景", value: useCases.slice(0, 3).join("、") || "未指定" },
  ];

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1fr_.92fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden p-3">
            <PromptImage className="aspect-[4/4.4] rounded-[18px]" src={selectedImage} alt={title} fit="contain" priority sizes="50vw" />
          </Card>
          {showThumbnails ? (
            <div className="grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-2xl border p-1 transition ${selectedImage === image ? "border-violet-500 bg-[#f1ecff]" : "border-[#eeeaf5] bg-white"}`}
                  aria-label={`查看第 ${index + 1} 张示例图`}
                >
                  <PromptImage className="aspect-square rounded-xl" src={image} alt={title} fit="contain" sizes="120px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-500">
            <Link className="hover:text-violet-700" href="/prompts">提示词库</Link> / <Link className="hover:text-violet-700" href={`/categories/${prompt.categorySlug}`}>{category}</Link> / {title}
          </div>
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{category}</Badge>
              {tags.slice(0, 4).map((tag) => (
                <Badge tone="gray" key={tag}>
                  {tag}
                </Badge>
              ))}
              <FavoriteButton promptSlug={prompt.slug} className="ml-auto grid size-10 place-items-center rounded-full border border-[#eeeaf5] shadow-sm transition" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-gray-600">{prompt.description || "这个提示词案例正在补充简介。"}</p>
            <div className="mt-4 flex gap-5 text-sm font-semibold text-gray-500">
              <span>收藏 {formatNumber(favoriteCount)}</span>
              <span>浏览 {formatNumber(prompt.views ?? 0)}</span>
            </div>
          </Card>

          <ExpandablePromptBlock title="中文提示词" content={chinesePrompt} defaultMaxHeight={160} />
          <ExpandablePromptBlock title="English Prompt" content={englishPrompt} defaultMaxHeight={220} />
          <CopyPromptButton text={allText} label="复制全部" copiedLabel="已复制" variant="primary" className="min-h-11 w-full justify-center text-sm" />

          <Card className="p-5">
            <h2 className="text-base font-black text-zinc-950">参数建议</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {params.map((item) => (
                <div className="rounded-2xl bg-[#faf9fc] p-4" key={item.label}>
                  <p className="text-xs font-bold text-gray-400">{item.label}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <details className="rounded-[18px] border border-[#eeeaf5] bg-white/80 p-4 text-sm text-gray-500 shadow-sm">
            <summary className="cursor-pointer select-none text-sm font-bold text-gray-600 transition hover:text-violet-700">来源与署名</summary>
            <div className="mt-3 space-y-2 text-xs leading-6 text-gray-500">
              <p>来源项目：{sourceName}</p>
              <p>许可协议：{sourceLicense}</p>
              {sourceUrl ? (
                <Link className="font-semibold text-violet-700 hover:text-violet-500" href={sourceUrl} target="_blank" rel="noreferrer">
                  查看 GitHub 来源
                </Link>
              ) : null}
              <p>本案例整理自公开开源资料，仅供提示词学习与参考。</p>
            </div>
          </details>
        </div>
      </section>
      <RelatedPrompts prompts={relatedPrompts} />
    </>
  );
}
