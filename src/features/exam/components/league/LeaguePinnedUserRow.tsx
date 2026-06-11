'use client';

import type { ImageSource } from '@/assets';
import { cn } from '@/utils/cn';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { VIP_AVATAR_BORDER_CLASS } from '@/features/store/constants/vipBadge';
import { getProfileStatusReaction } from '@/features/user/constants/profileStatusReactions';

type LeaguePinnedUserRowProps = {
  name: string;
  profileImage?: ImageSource | string | null;
  weeklyXp: number;
  position: number | null;
  hasVip?: boolean;
  statusId?: string | null;
  onClick?: () => void;
};

export function LeaguePinnedUserRow({
  name,
  profileImage,
  weeklyXp,
  position,
  hasVip,
  statusId,
  onClick,
}: LeaguePinnedUserRowProps) {
  const statusReaction = getProfileStatusReaction(statusId);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="pointer-events-none sticky bottom-0 z-20 -mx-1 px-1 pt-3 pb-1">
      <div className="h-6 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-sky-500/50',
          'bg-slate-900 px-4 py-3 shadow-lg shadow-black/30',
          'transition-colors hover:bg-slate-800',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
        )}
      >
        <div className="w-6 shrink-0 text-center text-sm font-bold text-slate-400">
          {position && position > 0 ? position : '—'}
        </div>

        <div className="relative shrink-0">
          <div
            className={cn(
              'relative h-11 w-11 overflow-hidden rounded-full border-2 bg-slate-800',
              hasVip ? VIP_AVATAR_BORDER_CLASS : 'border-slate-600'
            )}
          >
            <AvatarImage src={profileImage ?? undefined} alt={name} />
          </div>
          {statusReaction ? (
            <span
              className={cn(
                'absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full',
                'border-2 border-slate-900 bg-slate-800 text-sm'
              )}
            >
              {statusReaction.emoji}
            </span>
          ) : (
            <span
              className={cn(
                'absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full',
                'border-2 border-slate-900 bg-emerald-500'
              )}
            />
          )}
        </div>

        <div className="min-w-0 flex-1 truncate text-left">
          <span className="text-sm font-bold text-white">{initials || name}</span>
        </div>

        <div className="shrink-0 text-right text-sm font-bold text-slate-300">{weeklyXp} XP</div>
      </button>
    </div>
  );
}
