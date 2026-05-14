import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://prompthub.local"),
  title: {
    default: "PromptHub - GPT Image 2 提示词灵感库",
    template: "%s | PromptHub",
  },
  description: "收集高质量 GPT Image 2 图片案例、中文提示词、英文提示词与创作思路，帮助创作者快速搜索、浏览和复制 AI 图片提示词。",
  openGraph: {
    title: "PromptHub - GPT Image 2 提示词灵感库",
    description: "高质量 GPT Image 2 提示词案例库，支持分类浏览、关键词搜索和一键复制。",
    siteName: "PromptHub",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
