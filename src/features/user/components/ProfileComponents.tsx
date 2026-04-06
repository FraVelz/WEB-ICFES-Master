import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

export const ProfileCard = ({
  user,
}: {
  user?: { profileImage?: string; username?: string; displayName?: string; bio?: string };
}) => (
  <div
    className={cn(
      'rounded-2xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all',
      'duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
    )}
  >
    {/* Avatar Section */}
    <div className="relative mb-6">
      <div
        className={cn(
          'mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4',
          'border-cyan-500/30 bg-linear-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20',
          'transition-all duration-300 hover:scale-110 hover:border-cyan-400'
        )}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username || user.displayName || 'Usuario'}
            className="h-full w-full object-cover"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              if (el.parentElement) el.parentElement.innerHTML = '<span class="text-6xl">👤</span>';
            }}
          />
        ) : (
          <span className="text-6xl">👤</span>
        )}
      </div>
    </div>

    {/* Username */}
    <div className="mb-4 border-b border-cyan-500/20 pb-4 text-center">
      <h2 className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
        {user?.username || user?.displayName || 'Usuario'}
      </h2>
      <p className="mt-2 text-sm text-cyan-300/60">Miembro desde {new Date().toLocaleDateString()}</p>
    </div>

    {/* Bio */}
    {user?.bio && (
      <div className="pt-4 text-center">
        <p className="max-w-xs text-sm text-cyan-100/80 italic">"{user.bio}"</p>
      </div>
    )}
  </div>
);

export const RankBadge = ({
  rank,
}: {
  rank?: { color?: string; icon?: React.ReactNode; name?: string; percentage?: number };
}) => {
  if (!rank) return null;

  return (
    <div className="mb-6 text-center">
      <div
        className={cn(
          'mb-2 inline-block rounded-xl bg-linear-to-r px-6 py-3 shadow-lg transition-transform duration-300 hover:scale-105',
          rank.color
        )}
      >
        <div className="mb-2 text-4xl">{rank.icon}</div>
        <div className="text-lg font-bold">{rank.name}</div>
        <div className="text-sm opacity-90">{rank.percentage}% completado</div>
      </div>
    </div>
  );
};

export const StatsCard = ({
  userData,
}: {
  userData?: { progress?: { percentage: number; totalAttempts: number; streakDays: number } };
}) => {
  if (!userData?.progress) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all',
        'duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
      )}
    >
      <h3 className="mb-6 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
        Estadísticas
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <span className="text-slate-300">Desempeño:</span>
          <span className="font-bold text-purple-400">{userData.progress.percentage}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <span className="text-slate-300">Intentos:</span>
          <span className="font-bold text-purple-400">{userData.progress.totalAttempts}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Racha:</span>
          <span className="font-bold text-purple-400">🔥 {userData.progress.streakDays} días</span>
        </div>
      </div>
    </div>
  );
};

export const RanksGrid = ({
  allRanks,
  currentRank,
}: {
  allRanks: Array<{ name: string; icon: string; minScore: number }>;
  currentRank?: { name: string };
}) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
    {allRanks.map((r: { name: string; icon: string; minScore: number }, idx: number) => {
      const isCurrentRank = currentRank && r.name === currentRank.name;
      return (
        <div
          key={idx}
          className={cn(
            'rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105',
            isCurrentRank
              ? 'border-cyan-500/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
              : 'border-slate-700/50 bg-slate-800/20 hover:border-cyan-500/40'
          )}
        >
          <div className="mb-2 text-4xl">{r.icon}</div>
          <div className="text-sm font-bold text-white">{r.name}</div>
          <div className="text-xs text-slate-400">+{r.minScore}%</div>
          {isCurrentRank && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <Icon name="check-circle" />
              Actual
            </div>
          )}
        </div>
      );
    })}
  </div>
);
