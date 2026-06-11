import { cn } from '@/utils/cn';
import { Icon, type IconName } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { VIP_AVATAR_BORDER_CLASS } from '@/features/store/constants/vipBadge';
import { ProfileVipBadge } from './ProfileVipBadge';
import type { ImageSource } from '@/assets';
import type { ReactNode } from 'react';

type LevelInfo = {
  level?: number;
  levelIcon?: IconName | string;
  levelName?: string;
  levelColor?: string;
  xpProgress?: number;
  xpForNextLevel?: number | null;
};

type ProfileHeroCardProps = {
  profileImage: ImageSource | null;
  name: string;
  personalPhrase: string;
  createdAt: string;
  level: number;
  totalXP: number;
  levelInfo: LevelInfo | null;
  accent?: 'app' | 'purple';
  isVip?: boolean;
  headerActions: ReactNode;
  onEditProfile?: () => void;
};

const profileActionButtonClass = cn(
  'cursor-pointer rounded-lg border border-surface-border bg-surface-elevated p-2',
  'text-on-surface-muted transition-colors',
  'hover:bg-surface-via hover:text-on-surface',
  'dark:border-transparent dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white'
);

export function ProfileHeroCard({
  profileImage,
  name,
  personalPhrase,
  createdAt,
  level,
  totalXP,
  levelInfo,
  accent = 'app',
  isVip = false,
  headerActions,
  onEditProfile,
}: ProfileHeroCardProps) {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/90 relative mb-8 overflow-visible rounded-3xl border p-6',
        'shadow-lg backdrop-blur-xl md:p-10',
        'dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-2xl',
        isVip && 'ring-1 ring-amber-500/25 dark:ring-yellow-500/20'
      )}
    >
      <div className="absolute top-0 right-0 flex gap-2 p-4">
        {headerActions}
        {onEditProfile && (
          <button type="button" onClick={onEditProfile} className={profileActionButtonClass} title="Editar Perfil">
            <Icon name="edit" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="group relative shrink-0 overflow-visible pr-3 pb-3 md:pr-4 md:pb-4">
          <div
            className={cn(
              'bg-surface-via h-32 w-32 rounded-full border-4 p-1 shadow-lg md:h-40 md:w-40',
              'dark:bg-slate-950',
              isVip
                ? VIP_AVATAR_BORDER_CLASS
                : accent === 'purple'
                  ? 'border-purple-500/40 shadow-purple-500/20 dark:border-purple-500/30'
                  : 'border-app-ring/40 shadow-app-ring/15 dark:border-app-ring/30'
            )}
          >
            <div className="bg-surface-elevated relative h-full w-full overflow-hidden rounded-full dark:bg-slate-800">
              <AvatarImage src={profileImage} alt={name} className="rounded-full" />
            </div>
          </div>
          {isVip && (
            <div
              className="absolute top-0 right-2 text-lg text-amber-600 drop-shadow-md dark:text-yellow-400"
              title="Insignia VIP"
            >
              <Icon name="crown" />
            </div>
          )}
          <div
            className={cn(
              'absolute right-0 bottom-0 z-10 rounded-full border ' +
                'px-3 py-1 text-xs font-bold whitespace-nowrap shadow-md',
              'border-surface-border bg-surface-elevated dark:border-slate-700 dark:bg-slate-900',
              accent === 'purple'
                ? 'text-purple-700 dark:text-purple-400'
                : 'text-app-accent-strong dark:text-app-accent'
            )}
          >
            {levelInfo?.levelIcon && <Icon name={levelInfo.levelIcon} size="sm" className="inline" />} Nivel{' '}
            {levelInfo?.level || level}
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <h1 className="text-on-surface text-3xl font-bold md:text-4xl">{name}</h1>
            {isVip && <ProfileVipBadge />}
          </div>
          <p className="text-on-surface-muted text-lg italic">&quot;{personalPhrase}&quot;</p>
          <div className="text-on-surface-muted flex items-center justify-center gap-4 pt-2 text-sm md:justify-start">
            <span className="flex items-center gap-2">
              <Icon name="calendar-alt" />
              Miembro desde: {createdAt}
            </span>
          </div>

          <div className="mt-4 max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-base font-bold',
                    accent === 'purple'
                      ? 'text-purple-700 dark:text-purple-400'
                      : 'text-app-accent-strong dark:text-app-accent'
                  )}
                  title={`XP Total: ${totalXP || 0}`}
                >
                  {typeof totalXP === 'number' ? totalXP : 0}
                </span>
                <span className="text-on-surface-muted">XP Total</span>
              </div>
              {levelInfo?.xpForNextLevel != null && levelInfo.xpForNextLevel > 0 ? (
                <span className="text-on-surface-muted">
                  {levelInfo.xpForNextLevel} XP para Nivel {(levelInfo?.level || level) + 1}
                </span>
              ) : (
                <span className="font-semibold text-amber-700 dark:text-yellow-400">Nivel Máximo</span>
              )}
            </div>
            <div
              className={cn(
                'border-surface-border bg-surface-via h-4 overflow-hidden rounded-full border',
                'shadow-inner dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              <div
                className={cn(
                  'h-full bg-linear-to-r shadow-md transition-all duration-1000',
                  levelInfo?.levelColor ||
                    (accent === 'purple' ? 'from-purple-500 to-purple-600' : 'from-cta-from to-cta-progress-end')
                )}
                style={{ width: `${levelInfo?.xpProgress ?? 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">Nivel {levelInfo?.level ?? level}</span>
                <span className="text-on-surface-muted">•</span>
                <span className="text-on-surface-muted">{levelInfo?.levelName || 'Aprendiz'}</span>
                {levelInfo?.levelIcon && <Icon name={levelInfo.levelIcon} size="sm" />}
              </div>
              {levelInfo?.xpProgress != null && (
                <span className="text-on-surface-muted">{Math.round(levelInfo.xpProgress ?? 0)}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
