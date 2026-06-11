'use client';

import { cn } from '@/utils/cn';

type LeagueSkeletonRowsProps = {
  count?: number;
};

export function LeagueSkeletonRows({ count = 10 }: LeagueSkeletonRowsProps) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3',
            'animate-pulse'
          )}
        >
          <div className="h-3 w-4 rounded bg-slate-700/60" />
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-700/60" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-3/5 max-w-[12rem] rounded bg-slate-700/60" />
            <div className="h-2 w-2/5 max-w-[8rem] rounded bg-slate-800/80" />
          </div>
          <div className="h-3 w-10 rounded bg-slate-700/40" />
        </div>
      ))}
    </div>
  );
}
