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
            'border-surface-border/80 bg-surface-elevated/40 flex items-center gap-3 rounded-2xl border px-4 py-3',
            'animate-pulse'
          )}
        >
          <div className="bg-on-surface-muted/60 h-3 w-4 rounded" />
          <div className="bg-on-surface-muted/60 h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="bg-on-surface-muted/60 h-3 w-3/5 max-w-[12rem] rounded" />
            <div className="bg-surface-overlay/80 h-2 w-2/5 max-w-[8rem] rounded" />
          </div>
          <div className="bg-on-surface-muted/40 h-3 w-10 rounded" />
        </div>
      ))}
    </div>
  );
}
