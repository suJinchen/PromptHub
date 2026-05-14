import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#f1ecff] text-2xl text-violet-600">⌕</div>
      <h3 className="mt-5 text-xl font-black text-zinc-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>
      {actionHref && actionLabel ? <Button className="mt-6" href={actionHref}>{actionLabel}</Button> : null}
    </div>
  );
}
