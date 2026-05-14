"use client";

import { useEffect, useRef, useState } from "react";
import { CopyPromptButton } from "./CopyPromptButton";

type ExpandablePromptBlockProps = {
  title: string;
  content: string;
  defaultMaxHeight?: number;
};

export function ExpandablePromptBlock({ title, content, defaultMaxHeight = 180 }: ExpandablePromptBlockProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const checkOverflow = () => setCanExpand(element.scrollHeight > defaultMaxHeight + 8);
    checkOverflow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content, defaultMaxHeight]);

  return (
    <div className="rounded-[18px] border border-[#eeeaf5] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black text-zinc-950">{title}</h3>
        <CopyPromptButton text={content} />
      </div>

      <div className="relative">
        <p
          ref={contentRef}
          className="whitespace-pre-wrap text-sm leading-7 text-gray-600"
          style={{ maxHeight: expanded || !canExpand ? undefined : defaultMaxHeight, overflow: expanded || !canExpand ? "visible" : "hidden" }}
        >
          {content}
        </p>
        {!expanded && canExpand ? <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-white/0" /> : null}
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 text-xs font-bold text-violet-700 transition hover:text-violet-500"
        >
          {expanded ? "收起" : "展开全文"}
        </button>
      ) : null}
    </div>
  );
}
