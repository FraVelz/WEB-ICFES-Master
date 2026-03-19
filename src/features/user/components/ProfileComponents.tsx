import { Icon } from '@/shared/components/Icon';

export const ProfileCard = ({ user }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
    {/* Avatar Section */}
    <div className="relative mb-6">
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 flex items-center justify-center bg-linear-to-r from-cyan-500 to-blue-600 hover:border-cyan-400 transition-all duration-300 hover:scale-110 shadow-lg shadow-cyan-500/20">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username || user.displayName || 'Usuario'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span className="text-6xl">👤</span>';
            }}
          />
        ) : (
          <span className="text-6xl">👤</span>
        )}
      </div>
    </div>

    {/* Username */}
    <div className="text-center mb-4 border-b border-cyan-500/20 pb-4">
      <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.username || user?.displayName || 'Usuario'}</h2>
      <p className="text-sm text-cyan-300/60 mt-2">Miembro desde {new Date().toLocaleDateString()}</p>
    </div>

    {/* Bio */}
    {user?.bio && (
      <div className="text-center pt-4">
        <p className="text-sm italic text-cyan-100/80 max-w-xs">"{user.bio}"</p>
      </div>
    )}
  </div>
);

export const RankBadge = ({ rank }) => {
  if (!rank) return null;

  return (
    <div className="text-center mb-6">
      <div className={`inline-block bg-linear-to-r ${rank.color} px-6 py-3 rounded-xl mb-2 shadow-lg hover:scale-105 transition-transform duration-300`}>
        <div className="text-4xl mb-2">{rank.icon}</div>
        <div className="font-bold text-lg">{rank.name}</div>
        <div className="text-sm opacity-90">{rank.percentage}% completado</div>
      </div>
    </div>
  );
};

export const StatsCard = ({ userData }) => {
  if (!userData?.progress) return null;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
      <h3 className="font-bold text-lg mb-6 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Estadísticas</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
          <span className="text-slate-300">Desempeño:</span>
          <span className="font-bold text-purple-400">{userData.progress.percentage}%</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
          <span className="text-slate-300">Intentos:</span>
          <span className="font-bold text-purple-400">{userData.progress.totalAttempts}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Racha:</span>
          <span className="font-bold text-purple-400">🔥 {userData.progress.streakDays} días</span>
        </div>
      </div>
    </div>
  );
};

export const RanksGrid = ({ allRanks, currentRank }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {allRanks.map((r, idx) => {
      const isCurrentRank = currentRank && r.name === currentRank.name;
      return (
        <div
          key={idx}
          className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
            isCurrentRank
              ? 'border-cyan-500/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
              : 'border-slate-700/50 bg-slate-800/20 hover:border-cyan-500/40'
          }`}
        >
          <div className="text-4xl mb-2">{r.icon}</div>
          <div className="font-bold text-sm text-white">{r.name}</div>
          <div className="text-xs text-slate-400">+{r.minScore}%</div>
          {isCurrentRank && (
            <div className="flex items-center gap-1 text-cyan-400 text-xs mt-3 font-semibold">
              <Icon name="check-circle" />
              Actual
            </div>
          )}
        </div>
      );
    })}
  </div>
);
