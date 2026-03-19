import { Icon } from '@/shared/components/Icon';

export const ProfileCard = ({ user }) => (
  <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
    {/* Avatar Section */}
    <div className="relative mb-6">
      <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-cyan-500/30 bg-linear-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-110 hover:border-cyan-400">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username || user.displayName || 'Usuario'}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML =
                '<span className="text-6xl">👤</span>';
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
      <p className="mt-2 text-sm text-cyan-300/60">
        Miembro desde {new Date().toLocaleDateString()}
      </p>
    </div>

    {/* Bio */}
    {user?.bio && (
      <div className="pt-4 text-center">
        <p className="max-w-xs text-sm text-cyan-100/80 italic">"{user.bio}"</p>
      </div>
    )}
  </div>
);

export const RankBadge = ({ rank }) => {
  if (!rank) return null;

  return (
    <div className="mb-6 text-center">
      <div
        className={`inline-block bg-linear-to-r ${rank.color} mb-2 rounded-xl px-6 py-3 shadow-lg transition-transform duration-300 hover:scale-105`}
      >
        <div className="mb-2 text-4xl">{rank.icon}</div>
        <div className="text-lg font-bold">{rank.name}</div>
        <div className="text-sm opacity-90">{rank.percentage}% completado</div>
      </div>
    </div>
  );
};

export const StatsCard = ({ userData }) => {
  if (!userData?.progress) return null;

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
      <h3 className="mb-6 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
        Estadísticas
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <span className="text-slate-300">Desempeño:</span>
          <span className="font-bold text-purple-400">
            {userData.progress.percentage}%
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <span className="text-slate-300">Intentos:</span>
          <span className="font-bold text-purple-400">
            {userData.progress.totalAttempts}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Racha:</span>
          <span className="font-bold text-purple-400">
            🔥 {userData.progress.streakDays} días
          </span>
        </div>
      </div>
    </div>
  );
};

export const RanksGrid = ({ allRanks, currentRank }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
    {allRanks.map((r, idx) => {
      const isCurrentRank = currentRank && r.name === currentRank.name;
      return (
        <div
          key={idx}
          className={`rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105 ${
            isCurrentRank
              ? 'border-cyan-500/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
              : 'border-slate-700/50 bg-slate-800/20 hover:border-cyan-500/40'
          }`}
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
