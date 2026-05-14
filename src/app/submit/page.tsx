import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "投稿功能即将开放 - PromptHub",
  description: "PromptHub 投稿与审核系统正在准备中，当前可先浏览提示词库。",
};

export default function SubmitComingSoonPage() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-3xl py-12 text-center sm:py-20">
        <Card className="relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-20 -top-24 size-56 rounded-full bg-violet-100/70 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-20 size-56 rounded-full bg-fuchsia-100/60 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-[#f1ecff] text-2xl font-black text-violet-600">✦</span>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">投稿功能即将开放</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-gray-600">
              我们正在准备投稿与审核系统，后续将开放用户提交提示词案例。当前版本可以先浏览提示词库、搜索分类并复制详情页提示词。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/prompts" className="rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-700">
                返回提示词库
              </Link>
              <Link href="/categories" className="rounded-full border border-[#e8e5f0] bg-white px-6 py-3 text-sm font-bold text-violet-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-[#f7f2ff]">
                浏览分类
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
