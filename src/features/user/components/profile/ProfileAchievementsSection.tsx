import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type Achievement = {
  id: string;
  title: string;
  icon: string;
  status: string;
};

type ProfileAchievementsSectionProps = {
  achievements: Achievement[];
  showViewAll?: boolean;
  onViewAll?: () => void;
};

const STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

function sortAchievementsForProfile(achievements: Achievement[]): Achievement[] {
  return [...achievements].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
  );
}

export function ProfileAchievementsSection({ achievements, showViewAll, onViewAll }: ProfileAchievementsSectionProps) {
  const sortedAchievements = sortAchievementsForProfile(achievements);
  const visibleAchievements = sortedAchievements.slice(0, 9);
  const completedCount = achievements.filter((achievement) => achievement.status === 'completed').length;

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-xl font-bold">
            <Icon name="trophy" className="text-yellow-400" />
            Logros
          </h2>
          {achievements.length > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {completedCount} de {achievements.length} desbloqueados
            </p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-app-accent hover:text-app-accent-muted cursor-pointer text-xs font-bold tracking-wider uppercase"
          >
            Ver todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {visibleAchievements.map((achievement) => {
          const isUnlocked = achievement.status === 'completed';
          const inProgress = achievement.status === 'in_progress';
          return (
            <div
              key={achievement.id}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-xl border p-2 transition-all',
                isUnlocked
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                  : inProgress
                    ? 'border-app-ring/40 bg-app-ring/10 text-app-accent'
                    : 'border-slate-700 bg-slate-800/50 text-slate-600 opacity-50 grayscale'
              )}
              title={achievement.title}
            >
              <Icon name={typeof achievement.icon === 'string' ? achievement.icon : 'star'} className="mb-1 text-2xl" />
              {isUnlocked && (
                <Icon name="star" size="sm" className="absolute top-2 right-2 text-[8px] text-yellow-200" />
              )}
            </div>
          );
        })}
      </div>

      {achievements.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500">
          {showViewAll ? 'Completa lecciones para desbloquear logros.' : 'Sin logros desbloqueados aún.'}
        </p>
      )}
    </div>
  );
}
