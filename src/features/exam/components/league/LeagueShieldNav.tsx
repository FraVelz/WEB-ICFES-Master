'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { RANKS, getRankInfo } from '@/shared/constants/ranks';

type RankEntry = (typeof RANKS)[keyof typeof RANKS];

const SHIELD_STYLES: Record<string, { active: string; unlocked: string; locked: string }> = {
  novato: {
    active: 'from-amber-700 via-amber-500 to-amber-800 border-amber-400/60',
    unlocked: 'from-surface-border via-on-surface-muted to-surface-border border-surface-via/40',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  explorador: {
    active: 'from-emerald-600 via-emerald-400 to-emerald-700 border-emerald-300/50',
    unlocked: 'from-emerald-900/80 via-emerald-800/60 to-emerald-900/80 border-emerald-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  aprendiz: {
    active: 'from-sky-600 via-sky-400 to-sky-700 border-sky-300/50',
    unlocked: 'from-sky-900/80 via-sky-800/60 to-sky-900/80 border-sky-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  competente: {
    active: 'from-cyan-600 via-cyan-400 to-cyan-700 border-cyan-300/50',
    unlocked: 'from-cyan-900/80 via-cyan-800/60 to-cyan-900/80 border-cyan-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  avanzado: {
    active: 'from-violet-600 via-violet-400 to-violet-700 border-violet-300/50',
    unlocked: 'from-violet-900/80 via-violet-800/60 to-violet-900/80 border-violet-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  experto: {
    active: 'from-orange-600 via-orange-400 to-orange-700 border-orange-300/50',
    unlocked: 'from-orange-900/80 via-orange-800/60 to-orange-900/80 border-orange-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
  maestro: {
    active: 'from-yellow-500 via-amber-300 to-yellow-600 border-yellow-200/60',
    unlocked: 'from-yellow-900/80 via-amber-800/60 to-yellow-900/80 border-amber-700/30',
    locked: 'from-surface-overlay via-surface-border to-surface-elevated border-surface-border/30',
  },
};

type LeagueShieldNavProps = {
  selectedRank: string;
  myLeagueRank: string;
  onSelect: (rankId: string) => void;
};

function getShieldVariant(rank: RankEntry, myRank: RankEntry, isSelected: boolean): 'active' | 'unlocked' | 'locked' {
  if (isSelected) return 'active';
  if (rank.order > myRank.order) return 'locked';
  return 'unlocked';
}

export function LeagueShieldNav({ selectedRank, myLeagueRank, onSelect }: LeagueShieldNavProps) {
  const myRank = getRankInfo(myLeagueRank);
  const ranks = Object.values(RANKS).sort((a, b) => a.order - b.order);

  return (
    <div className="mb-8">
      <div className="no-scrollbar flex items-end justify-center gap-1 overflow-x-auto px-2 pb-2 sm:gap-2">
        {ranks.map((rank) => {
          const isSelected = selectedRank === rank.id;
          const isMyLeague = rank.id === myLeagueRank;
          const variant = getShieldVariant(rank, myRank, isSelected);
          const styles = SHIELD_STYLES[rank.id] ?? SHIELD_STYLES.novato;
          const gradient = styles[variant];
          const isLocked = variant === 'locked';

          return (
            <button
              key={rank.id}
              type="button"
              onClick={() => onSelect(rank.id)}
              className={cn(
                'group flex shrink-0 flex-col items-center gap-1.5 transition-transform focus-visible:outline-none',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via',
                isSelected ? 'scale-110' : 'scale-95 opacity-80 hover:scale-100 hover:opacity-100'
              )}
              aria-pressed={isSelected}
              aria-label={`Liga ${rank.label}`}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-t-lg rounded-b-[40%]',
                  'border-2 bg-linear-to-b shadow-md',
                  gradient,
                  isSelected ? 'h-16 w-14 sm:h-[4.5rem] sm:w-16' : 'h-12 w-10 sm:h-14 sm:w-12',
                  isLocked && 'grayscale'
                )}
              >
                {isLocked ? (
                  <Icon name="lock" className="text-on-surface-muted" size="sm" />
                ) : (
                  <Icon
                    name={rank.icon}
                    className={cn(isSelected ? 'text-white' : 'text-white/70')}
                    size={isSelected ? 'lg' : 'md'}
                  />
                )}
                {isMyLeague && !isSelected && (
                  <span
                    className={cn(
                      'bg-app-accent absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2',
                      'rounded-full'
                    )}
                  />
                )}
              </div>
              {isSelected && (
                <span className="max-w-[4.5rem] truncate text-center text-[10px] font-bold text-white sm:text-xs">
                  {rank.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
