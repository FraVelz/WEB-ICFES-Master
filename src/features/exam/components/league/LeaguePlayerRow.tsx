'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { VIP_AVATAR_BORDER_CLASS } from '@/features/store/constants/vipBadge';
import type { LeaderboardPlayer } from '@/hooks/gamification';
import { getProfileStatusReaction } from '@/features/user/constants/profileStatusReactions';

export type LeagueRowStyle = {
  status: string;
  icon: string;
  color: string;
  bg: string;
  label: string;
};

type LeaguePlayerRowProps = {
  player: LeaderboardPlayer;
  position: number;
  isCurrentUser: boolean;
  style: LeagueRowStyle;
  statusId?: string | null;
  onClick: () => void;
  showCrown?: boolean;
};

export function LeaguePlayerRow({
  player,
  position,
  isCurrentUser,
  style,
  statusId,
  onClick,
  showCrown,
}: LeaguePlayerRowProps) {
  const isVip = Boolean(player.hasVipBadge);
  const statusReaction = isCurrentUser ? getProfileStatusReaction(statusId) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all',
        isCurrentUser
          ? 'border-sky-500/40 bg-sky-950/30 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]'
          : cn(style.bg, 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50')
      )}
    >
      <div className="w-6 shrink-0 text-center text-sm font-bold text-slate-500">{position}</div>

      <div className="relative shrink-0">
        <div
          className={cn(
            'relative h-11 w-11 overflow-hidden rounded-full border-2 bg-slate-800',
            isVip ? VIP_AVATAR_BORDER_CLASS : 'border-slate-700'
          )}
        >
          <AvatarImage src={player.profileImage} alt={player.name || player.username || 'Jugador'} />
        </div>
        {statusReaction && (
          <span
            className={cn(
              'absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full',
              'border-2 border-slate-900 bg-slate-800 text-sm'
            )}
            title={statusReaction.label}
          >
            {statusReaction.emoji}
          </span>
        )}
        {showCrown && !statusReaction && (
          <span className="absolute -top-1.5 -right-1 text-amber-400">
            <Icon name="crown" size="sm" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={cn('truncate text-sm font-bold', isCurrentUser ? 'text-sky-300' : 'text-white')}>
            {player.name || player.username || 'Usuario'}
          </span>
          {isVip && (
            <span
              className={cn(
                'rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5',
                'text-[9px] font-bold text-amber-400'
              )}
            >
              VIP
            </span>
          )}
          {isCurrentUser && (
            <span className="rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-300">Tú</span>
          )}
        </div>
        <div className={cn('flex items-center gap-1 text-[11px]', style.color)}>
          <Icon name={style.icon as 'arrow-up'} size="sm" />
          <span>{style.label}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-white">{player.weeklyXP ?? 0} XP</div>
      </div>
    </button>
  );
}
