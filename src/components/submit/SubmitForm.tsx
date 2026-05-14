"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryItem } from "@/types/category";

type SubmitFormProps = { categories: CategoryItem[] };

type DraftState = {
  title: string;
  category: string;
  description: string;
  chinesePrompt: string;
  englishPrompt: string;
  selectedTags: string[];
  model: string;
  ratio: string;
  style: string;
  useCase: string;
  sourceUrl: string;
  sourceName: string;
  agree: boolean;
};

const DRAFT_KEY = "prompthub:submit-draft";
const tagOptions = ["人像", "摄影", "插画", "产品", "建筑", "风景", "科幻", "复古", "国风", "UI", "3D", "小红书"];

const emptyDraft: DraftState = {
  title: "",
  category: "",
  description: "",
  chinesePrompt: "",
  englishPrompt: "",
  selectedTags: [],
  model: "GPT Image 2",
  ratio: "",
  style: "",
  useCase: "",
  sourceUrl: "",
  sourceName: "",
  agree: false,
};

export function SubmitForm({ categories }: SubmitFormProps) {
  const [draft, setDraft] = useState<DraftState>(emptyDraft);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      draft.title.trim() &&
      draft.category &&
      draft.description.trim() &&
      draft.chinesePrompt.trim() &&
      imagePreview &&
      draft.agree,
    [draft, imagePreview],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<DraftState>;
      setDraft({ ...emptyDraft, ...saved, selectedTags: Array.isArray(saved.selectedTags) ? saved.selectedTags : [] });
      setMessage("已恢复上次保存的本地草稿。");
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateField<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: string) {
    setDraft((current) => {
      const selectedTags = current.selectedTags.includes(tag)
        ? current.selectedTags.filter((item) => item !== tag)
        : current.selectedTags.length >= 5
          ? current.selectedTags
          : [...current.selectedTags, tag];
      return { ...current, selectedTags };
    });
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage("图片不能超过 10MB，请重新选择。");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
    setMessage("图片已在本地预览，暂不会上传服务器。");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      setMessage("请先填写必填项、上传参考图片，并勾选投稿须知和版权声明。");
      return;
    }
    setMessage("投稿功能即将开放，当前为前端演示。");
  }

  function handleDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setMessage("草稿已保存到本地浏览器。");
  }

  function handleAiSuggest() {
    setMessage("AI 优化建议功能即将开放。");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[22px] border border-[#e8e5f0] bg-white p-6 shadow-[0_18px_50px_rgba(24,24,27,.055)] lg:p-8">
      <h2 className="text-2xl font-black text-zinc-950">提交提示词</h2>

      <div className="mt-7 space-y-8">
        <section>
          <h3 className="mb-4 text-base font-black text-zinc-950">基础信息</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-zinc-800">
              提示词标题 <span className="text-violet-600">*</span>
              <input value={draft.title} onChange={(event) => updateField("title", event.target.value)} className="h-11 w-full rounded-xl border border-[#e8e5f0] px-4 text-sm font-medium outline-none focus:border-violet-300" placeholder="给你的提示词起一个吸引人的标题" />
            </label>
            <label className="space-y-2 text-sm font-bold text-zinc-800">
              所属分类 <span className="text-violet-600">*</span>
              <select value={draft.category} onChange={(event) => updateField("category", event.target.value)} className="h-11 w-full rounded-xl border border-[#e8e5f0] px-4 text-sm font-medium outline-none focus:border-violet-300">
                <option value="">选择最合适的分类</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-zinc-800">标签（最多选择 5 个）</p>
            <div className="flex flex-wrap gap-2 rounded-xl border border-[#e8e5f0] p-3">
              {tagOptions.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${draft.selectedTags.includes(tag) ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-[#f1ecff] hover:text-violet-700"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <label className="mt-4 block space-y-2 text-sm font-bold text-zinc-800">
            简短描述 <span className="text-violet-600">*</span>
            <textarea value={draft.description} maxLength={200} onChange={(event) => updateField("description", event.target.value)} className="min-h-24 w-full rounded-xl border border-[#e8e5f0] p-4 text-sm font-medium outline-none focus:border-violet-300" placeholder="简要描述这个提示词的效果、用途或创作思路..." />
            <span className="block text-right text-xs font-semibold text-gray-400">{draft.description.length} / 200</span>
          </label>
        </section>

        <section>
          <h3 className="mb-4 text-base font-black text-zinc-950">提示词内容</h3>
          <label className="block space-y-2 text-sm font-bold text-zinc-800">
            中文提示词 <span className="text-violet-600">*</span>
            <textarea value={draft.chinesePrompt} onChange={(event) => updateField("chinesePrompt", event.target.value)} className="min-h-28 w-full rounded-xl border border-[#e8e5f0] p-4 text-sm font-medium outline-none focus:border-violet-300" placeholder="请输入中文提示词内容..." />
          </label>
          <div className="mt-2 text-right"><button type="button" onClick={handleAiSuggest} className="rounded-full border border-violet-200 px-3 py-1.5 text-xs font-bold text-violet-700">AI 优化建议</button></div>
          <label className="mt-4 block space-y-2 text-sm font-bold text-zinc-800">
            English Prompt
            <textarea value={draft.englishPrompt} onChange={(event) => updateField("englishPrompt", event.target.value)} className="min-h-28 w-full rounded-xl border border-[#e8e5f0] p-4 text-sm font-medium outline-none focus:border-violet-300" placeholder="请输入英文提示词内容（可选）..." />
          </label>
          <div className="mt-2 text-right"><button type="button" onClick={handleAiSuggest} className="rounded-full border border-violet-200 px-3 py-1.5 text-xs font-bold text-violet-700">AI 优化建议</button></div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-black text-zinc-950">参考图片 <span className="text-violet-600">*</span></h3>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-violet-300 bg-[#fbf9ff] p-6 text-center">
              <input type="file" accept="image/jpeg,image/png" onChange={handleImage} className="hidden" />
              <span className="grid size-12 place-items-center rounded-full bg-[#f1ecff] text-2xl text-violet-600">↑</span>
              <span className="mt-3 text-sm font-black text-zinc-900">点击上传图片</span>
              <span className="mt-1 text-xs text-gray-500">支持 JPG、PNG，最大 10MB</span>
            </label>
            <div className="overflow-hidden rounded-xl border border-[#e8e5f0] bg-[#faf9fc]">
              {imagePreview ? <div className="h-full min-h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }} aria-label="投稿图片预览" /> : <div className="grid h-full min-h-40 place-items-center text-sm font-semibold text-gray-400">图片预览</div>}
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-black text-zinc-950">参数建议（可选）</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <input value={draft.model} onChange={(event) => updateField("model", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="模型" />
            <input value={draft.ratio} onChange={(event) => updateField("ratio", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="比例，如 16:9" />
            <input value={draft.style} onChange={(event) => updateField("style", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="风格，如极简、写实" />
            <input value={draft.useCase} onChange={(event) => updateField("useCase", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="适用场景" />
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-base font-black text-zinc-950">来源信息</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={draft.sourceUrl} onChange={(event) => updateField("sourceUrl", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="来源链接 https://" />
            <input value={draft.sourceName} onChange={(event) => updateField("sourceName", event.target.value)} className="h-11 rounded-xl border border-[#e8e5f0] px-4 text-sm outline-none" placeholder="作者 / 来源" />
          </div>
        </section>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-[#eeeaf5] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-2 text-sm font-semibold text-gray-600">
          <input type="checkbox" checked={draft.agree} onChange={(event) => updateField("agree", event.target.checked)} className="mt-0.5 size-4 accent-violet-600" />
          <span>我已阅读并同意《投稿须知》和《版权声明》</span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleDraft} className="rounded-full border border-[#e8e5f0] bg-white px-6 py-2.5 text-sm font-bold text-gray-700">保存草稿</button>
          <button type="submit" className="rounded-full bg-violet-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm">提交投稿</button>
        </div>
      </div>
      {message ? <div className="mt-5 rounded-2xl bg-[#f1ecff] px-4 py-3 text-sm font-bold text-violet-700">{message}</div> : null}
    </form>
  );
}
