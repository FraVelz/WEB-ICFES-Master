import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const GamificationHub = () => {
  const [activeTab, setActiveTab] = useState('badges');

  const badges = [
    { id: 1, name: 'Primer Paso', icon: 'lightbulb', color: 'bg-yellow-500', rarity: 'común', achieved: true },
    { id: 2, name: 'Racha de Fuego', icon: 'fire', color: 'bg-red-500', rarity: 'raro', achieved: true },
    { id: 3, name: 'Matemático', icon: 'flask', color: 'bg-green-500', rarity: 'épico', achieved: false },
    { id: 4, name: 'Erudito', icon: 'star', color: 'bg-purple-500', rarity: 'legendario', achieved: false },
    { id: 5, name: 'Perfeccionista', icon: 'gem', color: 'bg-cyan-500', rarity: 'épico', achieved: true },
    { id: 6, name: 'Campeón', icon: 'trophy', color: 'bg-amber-500', rarity: 'legendario', achieved: false },
  ];

  const levels = [
    { level: 1, name: 'Aprendiz', minXp: 0, maxXp: 1000, currentXp: 450 },
    { level: 2, name: 'Estudiante', minXp: 1000, maxXp: 2500, currentXp: 0 },
    { level: 3, name: 'Avanzado', minXp: 2500, maxXp: 5000, currentXp: 0 },
  ];

  const leaderboard = [
    { rank: 1, name: 'Carlos M.', xp: 15420, streak: 45 },
    { rank: 2, name: 'Ana L.', xp: 14890, streak: 38 },
    { rank: 3, name: 'Juan P.', xp: 14120, streak: 32 },
    { rank: 4, name: 'Tú', xp: 12450, streak: 12, highlight: true },
    { rank: 5, name: 'María R.', xp: 11980, streak: 28 },
  ];

  const rarityColors = {
    común: 'text-gray-400',
    raro: 'text-blue-400',
    épico: 'text-purple-400',
    legendario: 'text-yellow-400'
  };

  return (
    <div className="w-full space-y-6">
      {/* Encabezado */}
      <div className="bg-linear-to-r from-amber-900 via-slate-900 to-slate-900 rounded-xl p-6 border border-amber-700/50">
        <h2 className="text-3xl font-bold text-white mb-2">
          <Icon name="trophy" className="text-amber-400 mr-2" />
          Centro de Gamificación
        </h2>
        <p className="text-slate-400">Gana XP, insignias y compite en el ranking global</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
        {[
          { id: 'badges', label: 'Insignias', icon: 'medal' },
          { id: 'levels', label: 'Niveles', icon: 'award' },
          { id: 'leaderboard', label: 'Ranking', icon: 'trophy' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* INSIGNIAS */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`group relative rounded-lg p-4 border transition-all duration-300 cursor-pointer ${
                  badge.achieved
                    ? 'bg-linear-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50'
                    : 'bg-slate-900/50 border-slate-700 opacity-60'
                }`}
              >
                {/* Rarity indicator */}
                <div className={`absolute top-2 right-2 text-xs font-bold uppercase ${rarityColors[badge.rarity]} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {badge.rarity}
                </div>

                {/* Icon */}
                <div className={`text-4xl mb-3 ${badge.color} p-3 rounded-lg inline-block text-white ${!badge.achieved && 'opacity-30'}`}>
                  <Icon name={badge.icon} />
                </div>

                {/* Name */}
                <p className={`font-bold ${badge.achieved ? 'text-white' : 'text-slate-500'}`}>
                  {badge.name}
                </p>

                {/* Badge achieved indicator */}
                {badge.achieved && (
                  <div className="mt-2 text-xs text-green-400 font-semibold">
                    Desbloqueado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIVELES */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          {levels.map((item, idx) => (
            <div key={idx} className="bg-linear-to-r from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Nivel {item.level}</h3>
                  <p className="text-slate-400">{item.name}</p>
                </div>
                <div className={`text-4xl font-bold ${idx === 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {item.level}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>{item.currentXp} / {item.maxXp - item.minXp} XP</span>
                  <span>{Math.round((item.currentXp / (item.maxXp - item.minXp)) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${(item.currentXp / (item.maxXp - item.minXp)) * 100}%` }}
                  />
                </div>
              </div>

              {idx === 0 && (
                <div className="mt-4 p-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                  <p className="text-cyan-400 text-sm font-semibold">
                    ¡Casi allí! {item.maxXp - item.minXp - item.currentXp} XP para el siguiente nivel
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RANKING */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {leaderboard.map(user => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                user.highlight
                  ? 'bg-linear-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700/70'
              }`}
            >
              {/* Rank */}
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-slate-700">
                {user.rank === 1 && <span className="text-yellow-400">🥇</span>}
                {user.rank === 2 && <span className="text-gray-400">🥈</span>}
                {user.rank === 3 && <span className="text-orange-400">🥉</span>}
                {user.rank > 3 && <span className="text-slate-400">{user.rank}</span>}
              </div>

              {/* User info */}
              <div className="flex-1">
                <p className={`font-bold ${user.highlight ? 'text-cyan-400' : 'text-white'}`}>
                  {user.name}
                </p>
                <div className="flex gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon name="star" className="text-yellow-400" />
                    {user.xp.toLocaleString()} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="fire" className="text-red-400" />
                    {user.streak} días
                  </span>
                </div>
              </div>

              {user.highlight && (
                <div className="text-cyan-400 font-bold">← Tú</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <button className="w-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 text-lg">
        <Icon name="ring" className="mr-2" />
        Continuar ganando XP
      </button>
    </div>
  );
};
