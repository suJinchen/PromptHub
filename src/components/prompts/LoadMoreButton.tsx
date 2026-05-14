"use client";

import { useState } from "react";

export function LoadMoreButton() {
  const [message, setMessage] = useState("");

  function handleClick() {
    setMessage("更多内容即将开放");
    window.setTimeout(() => setMessage(""), 1600);
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-3">
      <button
        type="button"
        onClick={handleClick}
        className="rounded-full border border-violet-200 bg-white px-6 py-2.5 text-sm font-bold text-violet-700 shadow-[0_10px_26px_rgba(109,74,255,.08)] transition hover:-translate-y-0.5 hover:bg-[#f8f5ff]"
      >
        加载更多
      </button>
      {message ? <p className="text-xs font-semibold text-violet-600">{message}</p> : null}
    </div>
  );
}
