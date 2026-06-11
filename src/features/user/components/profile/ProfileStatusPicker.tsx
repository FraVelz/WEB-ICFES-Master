'use client';

import { cn } from '@/utils/cn';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { useResolvedProfileAvatar } from '@/features/user/hooks/useResolvedProfileAvatar';
import { useProfileStatus } from '@/features/user/hooks/useProfileStatus';
import { PROFILE_STATUS_REACTIONS } from '@/features/user/constants/profileStatusReactions';
import { VIP_AVATAR_BORDER_CLASS } from '@/features/store/constants/vipBadge';
import { useVipBadge } from '@/features/store/hooks/useVipBadge';

export function ProfileStatusPicker() {
  const { user } = useAuth();
  const avatarSrc = useResolvedProfileAvatar(user?.profileImage);
  const { statusId, statusReaction, setStatus, clearStatus } = useProfileStatus();
  const hasVip = useVipBadge();

  const displayName = user?.displayName || 'Tú';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-on-surface text-sm font-bold">Elige tu estado</h3>
        {statusId && (
          <button
            type="button"
            onClick={clearStatus}
            className="text-xs font-bold tracking-wide text-sky-400 uppercase transition-colors hover:text-sky-300"
          >
            Borrar
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div
            className={cn(
              'h-24 w-24 overflow-hidden rounded-full border-4 bg-slate-800',
              hasVip ? VIP_AVATAR_BORDER_CLASS : 'border-slate-600'
            )}
          >
            <AvatarImage src={avatarSrc} alt={displayName} className="rounded-full" />
          </div>
          {statusReaction && (
            <span className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-xl shadow-md">
              {statusReaction.emoji}
            </span>
          )}
        </div>
      </div>

      <p className="text-on-surface-muted text-center text-sm font-medium">{displayName}</p>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {PROFILE_STATUS_REACTIONS.map((reaction) => {
          const isActive = statusId === reaction.id;
          return (
            <button
              key={reaction.id}
              type="button"
              title={reaction.label}
              onClick={() => setStatus(isActive ? null : reaction.id)}
              className={cn(
                'flex aspect-square items-center justify-center rounded-2xl border-2 text-2xl transition-all',
                'hover:scale-105 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'border-sky-500/60 bg-sky-500/15 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'border-slate-700/80 bg-slate-800/60 hover:border-slate-600 hover:bg-slate-800'
              )}
              aria-pressed={isActive}
              aria-label={reaction.label}
            >
              {reaction.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
