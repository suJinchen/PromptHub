import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { getAllCategories } from "@/lib/categories";
import { getAllPrompts, getPromptStats } from "@/lib/prompts";
import { getAllTags } from "@/lib/tags";

export const metadata: Metadata = {
  title: "关于 PromptHub",
  description: "PromptHub 是一个为 GPT Image 2 创作者整理的提示词灵感库。",
};

const values = [
  { title: "高质量案例", description: "精选案例图片与提示词结构，方便快速判断风格和用途。", icon: "★" },
  { title: "中英双语提示词", description: "同时保留中文整理版本和 English Prompt，适合学习与复制。", icon: "文" },
  { title: "分类搜索", description: "根据分类、标签和关键词快速找到合适的创作方向。", icon: "搜" },
  { title: "一键复制", description: "详情页支持复制中文提示词、English Prompt 和完整参数。", icon: "取" },
];

export default function AboutPage() {
  const stats = getPromptStats();
  const categories = getAllCategories();
  const tags = getAllTags();
  const prompts = getAllPrompts();
  const statCards = [
    { label: "提示词数量", value: prompts.length },
    { label: "分类数量", value: categories.length },
    { label: "标签数量", value: tags.length || stats.tagCount },
    { label: "本地收藏", value: "可用" },
  ];

  return (
    <section className="page-shell">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">关于 PromptHub</h1>
        <p className="mt-4 text-lg font-semibold text-gray-600">一个为 GPT Image 2 创作者整理的提示词灵感库。</p>
        <p className="mt-4 text-base leading-8 text-gray-600">
          PromptHub 用于整理和展示高质量 GPT Image 2 提示词案例，帮助用户根据分类、关键词和标签快速找到可参考、可复制的提示词。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <Card className="p-6 text-center" key={item.label}>
            <p className="text-3xl font-black text-violet-600">{item.value}</p>
            <p className="mt-2 text-sm font-bold text-gray-500">{item.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-black text-zinc-950">核心价值</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <Card className="p-6" key={item.title}>
              <div className="grid size-11 place-items-center rounded-2xl bg-[#f1ecff] text-lg font-black text-violet-600">{item.icon}</div>
              <h3 className="mt-5 text-lg font-black text-zinc-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-12 p-7">
        <h2 className="text-xl font-black text-zinc-950">免责声明</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
          <p>本站部分提示词案例基于公开资料整理与二次编辑，仅用于学习、参考与灵感收集。如有版权或授权问题，请联系处理。</p>
          <p>PromptHub 当前不提供在线生图服务；收藏功能为本地浏览器体验，投稿与社区功能仍在规划中。</p>
        </div>
      </Card>

      <Card className="mt-5 p-7">
        <h2 className="text-xl font-black text-zinc-950">内容来源与版权说明</h2>
        <p className="mt-4 text-sm leading-7 text-gray-600">
          PromptHub 当前部分提示词案例整理自公开开源项目与人工整理数据，主要用于 AI 图像提示词学习、检索和参考。部分案例来源于
          EvoLinkAI/awesome-gpt-image-2-API-and-Prompts，并保留内部来源字段用于署名与追溯。如相关内容涉及版权或授权问题，请联系我们处理。
        </p>
      </Card>
    </section>
  );
}
