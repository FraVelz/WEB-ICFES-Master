import { Icon } from '@/shared/components/Icon';

type Achievement = { id: string; status: string };

type ProfileStatsSectionProps = {
  achievements: Achievement[];
  level: number;
  totalXP: number;
  title?: string;
  showRanking?: boolean;
};

export function ProfileStatsSection({
  achievements,
  level,
  totalXP,
  title = 'Estadísticas Rápidas',
  showRanking = false,
}: ProfileStatsSectionProps) {
  const completed = achievements.filter((a) => a.status === 'completed').length;
  const cols = showRanking ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
        <Icon name="chart-line" className="text-green-400" />
        {title}
      </h2>
      <div className={`grid gap-4 ${cols}`}>
        <div className="rounded-xl bg-slate-800/50 p-4 text-center">
          <div className="text-2xl font-bold text-white">{completed}</div>
          <div className="mt-1 text-xs text-slate-400 uppercase">Logros</div>
        </div>
        <div className="rounded-xl bg-slate-800/50 p-4 text-center">
          <div className="text-2xl font-bold text-white">{level}</div>
          <div className="mt-1 text-xs text-slate-400 uppercase">Nivel</div>
        </div>
        <div className="rounded-xl bg-slate-800/50 p-4 text-center">
          <div className="text-2xl font-bold text-white">{typeof totalXP === 'number' ? totalXP : 0}</div>
          <div className="mt-1 text-xs text-slate-400 uppercase">XP Total</div>
        </div>
        {showRanking && (
          <div className="rounded-xl bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-white">Top 10%</div>
            <div className="mt-1 text-xs text-slate-400 uppercase">Ranking</div>
          </div>
        )}
      </div>
    </div>
  );
}
