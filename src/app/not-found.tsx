import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState title="没有找到这个页面" description="这个链接可能已经移动，或者对应的提示词内容还没有整理完成。" actionHref="/prompts" actionLabel="返回提示词库" />
      </section>
    </main>
  );
}
