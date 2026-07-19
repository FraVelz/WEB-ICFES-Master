import { Icon } from '@/shared/components/Icon';
import { formatStudyTime } from '@/services/studyTime';
import { cn } from '@/utils/cn';

import { getAchievementChainSummary } from '@/shared/constants/achievements/achievementChainDisplay';

type Achievement = { id: string; status: string };

type ProfileStatsSectionProps = {
  achievements: Achievement[];
  level: number;
  totalXP: number;
  studyTimeMinutes?: number;
  title?: string;
};

const statCardClass =
  'rounded-xl border border-surface-border bg-surface-via/70 p-4 text-center dark:border-transparent dark:bg-surface-overlay/50';

export function ProfileStatsSection({
  achievements,
  level,
  totalXP,
  studyTimeMinutes = 0,
  title = 'Estadísticas Rápidas',
}: ProfileStatsSectionProps) {
  const completed = getAchievementChainSummary(achievements).completedTiers;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6 shadow-sm',
        'dark:border-surface-border dark:bg-surface-elevated/50'
      )}
    >
      <h2 className="text-on-surface mb-6 flex items-center gap-3 text-xl font-bold">
        <Icon name="chart-line" className="text-emerald-600 dark:text-green-400" />
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className={statCardClass}>
          <div className="text-on-surface text-2xl font-bold">{completed}</div>
          <div className="text-on-surface-muted mt-1 text-xs uppercase">Logros</div>
        </div>
        <div className={statCardClass}>
          <div className="text-on-surface text-2xl font-bold">{level}</div>
          <div className="text-on-surface-muted mt-1 text-xs uppercase">Nivel</div>
        </div>
        <div className={statCardClass}>
          <div className="text-on-surface text-2xl font-bold">{typeof totalXP === 'number' ? totalXP : 0}</div>
          <div className="text-on-surface-muted mt-1 text-xs uppercase">XP Total</div>
        </div>
        <div className={statCardClass}>
          <div className="text-on-surface text-2xl font-bold">{formatStudyTime(studyTimeMinutes)}</div>
          <div className="text-on-surface-muted mt-1 text-xs uppercase">Tiempo de estudio</div>
        </div>
      </div>
    </div>
  );
}
