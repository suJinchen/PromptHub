"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchBarProps = { placeholder?: string; defaultValue?: string; className?: string };

export function SearchBar({ placeholder = "搜索提示词、主题或风格...", defaultValue = "", className = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  return (
    <form className={`flex w-full items-center gap-2 rounded-full border border-[#e8e5f0] bg-white p-2 shadow-[0_14px_36px_rgba(24,24,27,.07)] ${className}`} onSubmit={(event) => { event.preventDefault(); const value = query.trim(); router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search"); }}>
      <span className="grid size-9 shrink-0 place-items-center text-gray-500" aria-hidden="true"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="7" /></svg></span>
      <input className="min-w-0 flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-gray-400 sm:text-base" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} />
      <button className="min-h-9 rounded-full bg-violet-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-500 sm:px-7" type="submit">搜索</button>
    </form>
  );
}
