import type { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  children: ReactNode;
}

export function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
        {title}
      </h2>
      <div className="text-sm text-slate-800/90 leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  );
}
