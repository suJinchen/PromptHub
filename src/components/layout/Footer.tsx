import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#eeeaf5] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2 font-bold text-zinc-900"><span className="text-violet-600">✦</span> PromptHub</div>
        <p>精选 GPT Image 2 提示词案例，帮助你发现、收藏与复制灵感。</p>
        <div className="flex gap-5 font-semibold text-gray-600"><Link href="/prompts">提示词库</Link><Link href="/categories">分类</Link><Link href="/about">关于</Link></div>
      </div>
    </footer>
  );
}
