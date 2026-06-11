'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { getRankInfo } from '@/shared/constants/ranks';
import { formatCountdownToReset } from '@/services/league/leagueWeekUtils';
import type { ProfileLeagueDisplay } from './profileLeagueTypes';

type ProfileLeagueSectionProps = {
  league: ProfileLeagueDisplay;
  loading?: boolean;
  showCta?: boolean;
  resetMs?: number;
};

const statTileClass = cn(
  'rounded-xl border border-surface-border bg-surface-via/70 p-3 text-center',
  'dark:border-transparent dark:bg-surface-overlay/50'
);

export function ProfileLeagueSection({ league, loading = false, showCta = false, resetMs }: ProfileLeagueSectionProps) {
  const rankInfo = getRankInfo(league.leagueRank);
  const hasWeeklyXp = league.weeklyXp > 0;
  const showGroupMeta = league.inGroup && league.groupNumber != null;

  if (loading) {
    return (
      <div
        className={cn(
          'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6 shadow-sm',
          'dark:border-surface-border dark:bg-surface-elevated/50'
        )}
      >
        <LoadingState label="Cargando torneo..." layout="section" className="min-h-[8rem] py-6" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6 shadow-sm',
        'dark:border-surface-border dark:bg-surface-elevated/50'
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-on-surface flex items-center gap-3 text-xl font-bold">
            <Icon name="trophy" className="text-amber-600 dark:text-yellow-400" />
            Torneo semanal
          </h2>
          <p className="text-on-surface-muted mt-1 text-xs">Clasificatoria por divisiones</p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br text-white shadow-sm',
            rankInfo.color,
            'border-white/20'
          )}
          title={`División ${rankInfo.label}`}
        >
          <Icon name={rankInfo.icon} className="text-lg" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-on-surface text-sm font-semibold">División {rankInfo.label}</p>
        {showGroupMeta ? (
          <p className="text-on-surface-muted mt-1 text-xs">
            Grupo {league.groupNumber} · {league.memberCount ?? 0}/{league.groupSize} competidores
          </p>
        ) : (
          <p className="text-on-surface-muted mt-1 text-xs">Sin grupo asignado esta semana</p>
        )}
        {typeof resetMs === 'number' && showCta && (
          <p className="text-app-accent-muted mt-2 text-xs">
            Próximo reset:{' '}
            <span className="text-app-accent font-mono font-semibold">{formatCountdownToReset(resetMs)}</span>
          </p>
        )}
      </div>

      {hasWeeklyXp ? (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className={statTileClass}>
            <div className="text-on-surface text-xl font-bold">{league.weeklyXp}</div>
            <div className="text-on-surface-muted mt-1 text-[10px] uppercase">XP semanal</div>
          </div>
          <div className={statTileClass}>
            <div className="text-on-surface text-xl font-bold">
              {league.myPosition != null ? `#${league.myPosition}` : '—'}
            </div>
            <div className="text-on-surface-muted mt-1 text-[10px] uppercase">Posición</div>
          </div>
        </div>
      ) : (
        <p className="text-on-surface-muted mb-4 text-sm leading-relaxed">
          {showCta
            ? 'Completa una lección para sumar XP y aparecer en el ranking de tu grupo.'
            : 'Aún no ha sumado XP en el torneo de esta semana.'}
        </p>
      )}

      {showCta && (
        <Link
          href="/clasificatoria"
          className={cn(
            'border-app-accent/40 inline-flex w-full items-center justify-center gap-2 rounded-xl border',
            'bg-app-accent/10 text-app-accent-strong px-4 py-2.5 text-sm font-semibold transition-colors',
            'hover:border-app-accent/60 hover:bg-app-accent/15',
            'dark:text-app-accent dark:hover:bg-app-accent/20',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-elevated'
          )}
        >
          <Icon name="chart-line" />
          Ver clasificatoria
        </Link>
      )}
    </div>
  );
}
