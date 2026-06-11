'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants';
import { ProfileStatusPicker } from '@/features/user/components/profile/ProfileStatusPicker';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function LeaderboardAsidePanels() {
  const { currentArea, currentAreaData, currentStreak, coins } = useDashboardShell();
  const areaExamHref = getPracticaHrefForRoadmapArea(currentArea);

  return (
    <>
      <AsideCard title="Tu perfil" icon="user" className="border-slate-700/60 dark:bg-slate-900/80">
        <ProfileStatusPicker />
      </AsideCard>

      <AsideCard title="Tu energía" icon="fire">
        <ul className="text-on-surface-muted space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Racha activa</span>
            <span className="font-semibold text-orange-500">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins}</span>
          </li>
        </ul>
      </AsideCard>

      {areaExamHref ? (
        <AsideCard title="Simulacro" icon="brain">
          <p className="text-on-surface-muted mb-3 text-xs leading-relaxed">Simulacro de {currentAreaData.name}</p>
          <Link
            href={areaExamHref}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold',
              'border-purple-500/40 text-purple-300 transition-colors hover:bg-purple-500/10',
              'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none'
            )}
          >
            Examen general
          </Link>
        </AsideCard>
      ) : null}
    </>
  );
}
