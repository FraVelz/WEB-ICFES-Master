'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useLeagueContext } from '@/hooks/gamification/LeagueContext';
import { getRankInfo } from '@/shared/constants/ranks';
import { LEAGUES_TEMPORARILY_DISABLED } from '@/shared/constants/gamification';
import { LeagueDisabledNotice } from '@/features/exam/components/league/LeagueDisabledNotice';
import { getLigasHref } from '@/features/exam/utils/leagueNavigation';
import { ProfileStatusPicker } from '@/features/user/components/profile/ProfileStatusPicker';
import { AsideCard } from './AsideCard';
import { AsideAdSlot } from './AsideAdSlot';

export function LeaderboardAsidePanels() {
  const { leagueState, leagueRank, loading: leagueLoading } = useLeagueContext();

  const rankInfo = getRankInfo(leagueRank);

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
        {LEAGUES_TEMPORARILY_DISABLED ? <LeagueDisabledNotice className="mb-3" /> : null}
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

      <AsideAdSlot slot="ligas-aside" />
    </>
  );
}
