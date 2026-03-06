'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faArrowUp, 
  faArrowDown, 
  faMinus, 
  faInfoCircle,
  faSpinner,
  faCrown
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/features/logros/hooks/useLeaderboard';
import { RANKS, getRankInfo } from '@/features/logros/constants/ranks';
import { ConstructionAlert } from '@/shared/components';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';

export const ClasificatoriaPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { rank: myRank } = useUserProfile(); // Obtener mi rango actual
  
  const [selectedRank, setSelectedRank] = useState('novato');
  const { leaderboardData, loading, error } = useLeaderboard(selectedRank);
  const currentRankInfo = getRankInfo(selectedRank);

  // Actualizar tab seleccionado cuando carga mi rango
  useEffect(() => {
    if (myRank) {
      setSelectedRank(myRank);
    }
  }, [myRank]);

  const getPositionStyle = (index, totalUsers) => {
    const position = index + 1;
    
    // Zona de Ascenso
    if (currentRankInfo.promoteCount > 0 && position <= currentRankInfo.promoteCount) {
      return { 
        status: 'promote', 
        icon: faArrowUp, 
        color: 'text-green-400', 
        bg: 'bg-green-500/10 border-green-500/30',
        label: 'Zona de Ascenso'
      };
    }
    
    // Zona de Descenso
    if (currentRankInfo.demoteCount > 0 && position > (totalUsers - currentRankInfo.demoteCount)) {
      return { 
        status: 'demote', 
        icon: faArrowDown, 
        color: 'text-red-400', 
        bg: 'bg-red-500/10 border-red-500/30',
        label: 'Zona de Descenso'
      };
    }

    return { 
      status: 'stable', 
      icon: faMinus, 
      color: 'text-slate-400', 
      bg: 'bg-slate-800/30 border-slate-700/50',
      label: 'Zona Segura'
    };
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Clasificatoria Semanal
          </h1>
          <p className="text-slate-400">
            Compite con otros estudiantes y sube de rango. ¡Se actualiza cada lunes!
          </p>
        </div>

        {/* Rank Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {Object.values(RANKS).map((rank) => (
            <button
              key={rank.id}
              onClick={() => setSelectedRank(rank.id)}
              className={` cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${
                selectedRank === rank.id
                  ? `bg-gradient-to-r ${rank.color} text-white border-transparent shadow-lg`
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{rank.icon}</span>
              <span className="font-bold">{rank.label}</span>
            </button>
          ))}
        </div>

        {/* Rank Info Card */}
        <div className={`bg-gradient-to-r ${currentRankInfo.color} p-[1px] rounded-2xl mb-8`}>
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentRankInfo.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {currentRankInfo.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentRankInfo.label}</h2>
                  <p className="text-slate-400 text-sm">
                    {currentRankInfo.promoteCount > 0 ? `Top ${currentRankInfo.promoteCount} suben` : 'Rango Máximo'} • 
                    {currentRankInfo.demoteCount > 0 ? ` Últimos ${currentRankInfo.demoteCount} bajan` : ' Sin descenso'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 text-center">
                <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold text-white">{leaderboardData.length}</div>
                  <div className="text-xs text-slate-400 uppercase">Competidores</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-cyan-400 mb-4" />
              <p className="text-slate-400">Cargando clasificación...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-500/10 rounded-2xl border border-red-500/20">
              <div className="text-4xl mb-4 text-red-400">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Error al cargar</h3>
              <p className="text-slate-400 px-4">
                {error.message.includes('index') 
                  ? 'Estamos optimizando la base de datos. Por favor espera unos minutos.' 
                  : 'Hubo un problema al cargar la clasificación.'}
              </p>
            </div>
          ) : leaderboardData.length > 0 ? (
            leaderboardData.map((player, index) => {
              const isCurrentUser = user?.uid === player.id;
              const style = getPositionStyle(index, leaderboardData.length);
              
              return (
                <div 
                  key={player.id}
                  onClick={() => router.push(isCurrentUser ? '/perfil' : `/perfil/public?userId=${player.id}`)}
                  className={`relative group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrentUser 
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                      : `${style.bg} hover:bg-slate-800`
                  }`}
                >
                  {/* Position */}
                  <div className="w-8 text-center font-bold text-lg text-slate-300">
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800">
                      <img 
                        src={player.photoUrl || player.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name || player.username}`} 
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-2 -right-1 text-yellow-400 text-lg drop-shadow-lg">
                        <FontAwesomeIcon icon={faCrown} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold truncate ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
                        {player.name || player.username || 'Usuario'}
                      </h3>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          Tú
                        </span>
                      )}
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${style.color}`}>
                      <FontAwesomeIcon icon={style.icon} />
                      {style.label}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{player.weeklyXP || 0} XP</div>
                    <div className="text-xs text-slate-500">Esta semana</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="text-4xl mb-4">😴</div>
              <h3 className="text-xl font-bold text-white mb-2">¡Está muy tranquilo por aquí!</h3>
              <p className="text-slate-400">
                Sé el primero en sumar puntos en la liga {currentRankInfo.label}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
