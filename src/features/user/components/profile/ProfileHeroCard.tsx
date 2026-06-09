import { cn } from '@/utils/cn';
import { Icon, type IconName } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { resolveProfileAvatarSrc } from '@/features/user/constants/defaultProfileAvatar';
import type { ReactNode } from 'react';

type LevelInfo = {
  level?: number;
  levelIcon?: IconName;
  levelName?: string;
  levelColor?: string;
  xpProgress?: number;
  xpForNextLevel?: number | null;
};

type ProfileHeroCardProps = {
  profileImage: string | null;
  name: string;
  personalPhrase: string;
  createdAt: string;
  level: number;
  totalXP: number;
  levelInfo: LevelInfo | null;
  accent?: 'app' | 'purple';
  headerActions: ReactNode;
  onEditProfile?: () => void;
};

export function ProfileHeroCard({
  profileImage,
  name,
  personalPhrase,
  createdAt,
  level,
  totalXP,
  levelInfo,
  accent = 'app',
  headerActions,
  onEditProfile,
}: ProfileHeroCardProps) {
  return (
    <div
      className={cn(
        'relative mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6',
        'shadow-2xl backdrop-blur-xl md:p-10'
      )}
    >
      <div className="absolute top-0 right-0 flex gap-2 p-4">
        {headerActions}
        {onEditProfile && (
          <button
            type="button"
            onClick={onEditProfile}
            className="cursor-pointer rounded-lg bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Editar Perfil"
          >
            <Icon name="edit" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="group relative">
          <div
            className={cn(
              'h-32 w-32 rounded-full border-4 bg-slate-950 p-1 shadow-lg md:h-40 md:w-40',
              accent === 'purple'
                ? 'border-purple-500/30 shadow-purple-500/20'
                : 'border-app-ring/30 shadow-app-ring/20'
            )}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-800">
              <AvatarImage
                src={resolveProfileAvatarSrc(profileImage, name)}
                alt={name}
                className="rounded-full"
              />
            </div>
          </div>
          <div
            className={cn(
              'absolute -right-2 -bottom-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1',
              'text-xs font-bold shadow-lg',
              accent === 'purple' ? 'text-purple-400' : 'text-app-accent'
            )}
          >
            {levelInfo?.levelIcon && <Icon name={levelInfo.levelIcon} size="sm" className="inline" />}{' '}
            Nivel {levelInfo?.level || level}
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{name}</h1>
          <p className="text-lg text-slate-400 italic">&quot;{personalPhrase}&quot;</p>
          <div className="flex items-center justify-center gap-4 pt-2 text-sm text-slate-500 md:justify-start">
            <span className="flex items-center gap-2">
              <Icon name="calendar-alt" />
              Miembro desde: {createdAt}
            </span>
          </div>

          <div className="mt-4 max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span
                  className={cn('text-base font-bold', accent === 'purple' ? 'text-purple-400' : 'text-app-accent')}
                  title={`XP Total: ${totalXP || 0}`}
                >
                  {typeof totalXP === 'number' ? totalXP : 0}
                </span>
                <span className="text-slate-400">XP Total</span>
              </div>
              {levelInfo?.xpForNextLevel != null && levelInfo.xpForNextLevel > 0 ? (
                <span className="text-slate-500">
                  {levelInfo.xpForNextLevel} XP para Nivel {(levelInfo?.level || level) + 1}
                </span>
              ) : (
                <span className="font-semibold text-yellow-400">Nivel Máximo</span>
              )}
            </div>
            <div className="h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-800 shadow-inner">
              <div
                className={cn(
                  'h-full bg-linear-to-r shadow-lg transition-all duration-1000',
                  levelInfo?.levelColor ||
                    (accent === 'purple' ? 'from-purple-500 to-purple-600' : 'from-cta-from to-cta-progress-end')
                )}
                style={{ width: `${levelInfo?.xpProgress ?? 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">Nivel {levelInfo?.level ?? level}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{levelInfo?.levelName || 'Aprendiz'}</span>
                {levelInfo?.levelIcon && <Icon name={levelInfo.levelIcon} size="sm" />}
              </div>
              {levelInfo?.xpProgress != null && (
                <span className="text-slate-500">{Math.round(levelInfo.xpProgress ?? 0)}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
