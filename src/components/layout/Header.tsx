"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/prompts", label: "提示词库" },
  { href: "/categories", label: "分类" },
  { href: "/about", label: "关于" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-8 place-items-center text-violet-600">
        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5 13.6 8 19 9.8l-5.4 1.7L12 17l-1.6-5.5L5 9.8 10.4 8 12 2.5Z" />
          <path d="M18.5 15.5 19.2 18l2.3.7-2.3.8-.7 2.5-.8-2.5-2.2-.8 2.2-.7.8-2.5Z" />
        </svg>
      </span>
      <span className="text-xl font-black tracking-tight text-zinc-950">PromptHub</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eeeaf5] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label="PromptHub 首页"><Logo /></Link>
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={`relative py-5 text-sm font-bold transition ${active ? "text-violet-600" : "text-zinc-700 hover:text-violet-600"}`}>
                {item.label}
                {active ? <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-violet-600" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="grid size-10 place-items-center rounded-full border border-[#eeeaf5] bg-white text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:text-violet-600" aria-label="搜索">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-10 place-items-center rounded-full border border-[#eeeaf5] bg-white text-violet-600 md:hidden" aria-label="打开导航">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      {open ? (
        <div className="mx-auto max-w-[1280px] px-4 pb-4 md:hidden">
          <nav className="grid gap-2 rounded-3xl border border-[#eeeaf5] bg-white p-3 shadow-lg shadow-violet-100/40">
            {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-2xl px-4 py-3 text-sm font-bold ${isActive(pathname, item.href) ? "bg-[#f1ecff] text-violet-700" : "text-zinc-700 hover:bg-zinc-50"}`}>{item.label}</Link>)}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
