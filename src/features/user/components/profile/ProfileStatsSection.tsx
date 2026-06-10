import { Icon } from '@/shared/components/Icon';
import { formatStudyTime } from '@/services/studyTime';
import { cn } from '@/utils/cn';

type Achievement = { id: string; status: string };

type ProfileStatsSectionProps = {
  achievements: Achievement[];
  level: number;
  totalXP: number;
  studyTimeMinutes?: number;
  title?: string;
  showRanking?: boolean;
};

const statCardClass = cn(
  'rounded-xl border border-surface-border bg-surface-via/70 p-4 text-center',
  'dark:border-transparent dark:bg-slate-800/50'
);

export function ProfileStatsSection({
  achievements,
  level,
  totalXP,
  studyTimeMinutes = 0,
  title = 'Estadísticas Rápidas',
  showRanking = false,
}: ProfileStatsSectionProps) {
  const completed = achievements.filter((a) => a.status === 'completed').length;

  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-border bg-surface-elevated/80 p-6 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-on-surface">
        <Icon name="chart-line" className="text-emerald-600 dark:text-green-400" />
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-on-surface">{completed}</div>
          <div className="mt-1 text-xs text-on-surface-muted uppercase">Logros</div>
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-on-surface">{level}</div>
          <div className="mt-1 text-xs text-on-surface-muted uppercase">Nivel</div>
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-on-surface">{typeof totalXP === 'number' ? totalXP : 0}</div>
          <div className="mt-1 text-xs text-on-surface-muted uppercase">XP Total</div>
        </div>
        <div className={statCardClass}>
          <div className="text-2xl font-bold text-on-surface">{formatStudyTime(studyTimeMinutes)}</div>
          <div className="mt-1 text-xs text-on-surface-muted uppercase">Tiempo de estudio</div>
        </div>
        {showRanking && (
          <div className={statCardClass}>
            <div className="text-2xl font-bold text-on-surface">Top 10%</div>
            <div className="mt-1 text-xs text-on-surface-muted uppercase">Ranking</div>
          </div>
        )}
      </div>
    </div>
  );
}
