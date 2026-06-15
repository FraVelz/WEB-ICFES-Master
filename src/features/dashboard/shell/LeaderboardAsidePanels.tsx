'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants';
import { useLeagueContext } from '@/hooks/gamification/LeagueContext';
import { getRankInfo } from '@/shared/constants/ranks';
import { LEAGUES_TEMPORARILY_DISABLED } from '@/shared/constants/gamification';
import { LeagueDisabledNotice } from '@/features/exam/components/league/LeagueDisabledNotice';
import { getLigasHref } from '@/features/exam/utils/leagueNavigation';
import { ProfileStatusPicker } from '@/features/user/components/profile/ProfileStatusPicker';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

export function LeaderboardAsidePanels() {
  const { currentArea, currentAreaData, currentStreak, coins } = useDashboardShell();
  const { leagueState, leagueRank, loading: leagueLoading } = useLeagueContext();
  const rankInfo = getRankInfo(leagueRank);
  const areaExamHref = getPracticaHrefForRoadmapArea(currentArea);

  const weeklyXp = leagueState?.weeklyXp ?? 0;
  const position = leagueState?.weeklyXp ? leagueState.myPosition : null;
  const groupLabel =
    leagueState?.leagueGroupId && leagueState.groupNumber != null
      ? `Grupo ${leagueState.groupNumber}`
      : 'Sin grupo esta semana';

  return (
    <>
      <AsideCard title="Tu perfil" icon="user" className="border-surface-border/60 dark:bg-surface-elevated/80">
        <ProfileStatusPicker />
      </AsideCard>

      <AsideCard title="Tu liga" icon="trophy">
        {LEAGUES_TEMPORARILY_DISABLED ? (
          <LeagueDisabledNotice className="mb-3" />
        ) : null}
        <p className="text-on-surface text-lg font-bold">División {rankInfo.label}</p>
        <ul className="text-on-surface-muted mt-3 space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>XP semanal</span>
            <span className="text-on-surface font-semibold">{leagueLoading ? '…' : weeklyXp}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Torneo</span>
            <span className="text-on-surface text-right font-semibold">{groupLabel}</span>
          </li>
          {position != null ? (
            <li className="flex justify-between gap-2">
              <span>Posición en grupo</span>
              <span className="text-on-surface font-semibold">#{position}</span>
            </li>
          ) : null}
        </ul>
        <Link
          href={getLigasHref()}
          className={cn(
            'text-app-accent hover:text-app-accent-muted mt-4 inline-flex text-xs font-semibold underline',
            'underline-offset-2 transition-colors'
          )}
        >
          Ver ligas completas
        </Link>
      </AsideCard>

      <AsideCard title="Tu energía" icon="fire">
        <ul className="text-on-surface-muted space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Racha activa</span>
            <span className="font-semibold text-orange-500">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins.toLocaleString('es-CO')}</span>
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
            Simulacro general
          </Link>
        </AsideCard>
      ) : null}
    </>
  );
}
