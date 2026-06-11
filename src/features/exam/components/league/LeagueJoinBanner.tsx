'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';

type LeagueJoinBannerProps = {
  rankLabel: string;
};

export function LeagueJoinBanner({ rankLabel }: LeagueJoinBannerProps) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-lg font-bold text-white sm:text-xl">División {rankLabel}</h2>
      <p className="text-on-surface-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
        Completa una lección para unirte a la competencia de esta semana
      </p>
      <Link
        href="/ruta-aprendizaje"
        className={cn(
          'mt-5 inline-flex w-full max-w-sm items-center justify-center rounded-2xl border-2 border-sky-500/50',
          'bg-surface-elevated/80 px-6 py-3.5 text-sm font-extrabold tracking-wide text-sky-300 uppercase',
          'hover:bg-surface-overlay transition-colors hover:border-sky-400 hover:text-sky-200',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface-via'
        )}
      >
        Haz una lección
      </Link>
    </div>
  );
}
