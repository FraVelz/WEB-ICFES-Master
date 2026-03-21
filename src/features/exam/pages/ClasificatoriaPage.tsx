'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard, type LeaderboardPlayer } from '@/features/logros/hooks/useLeaderboard';
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

  const getPositionStyle = (index: number, totalUsers: number) => {
    const position = index + 1;

    // Zona de Ascenso
    if (
      currentRankInfo.promoteCount > 0 &&
      position <= currentRankInfo.promoteCount
    ) {
      return {
        status: 'promote',
        icon: 'arrow-up',
        color: 'text-green-400',
        bg: 'bg-green-500/10 border-green-500/30',
        label: 'Zona de Ascenso',
      };
    }

    // Zona de Descenso
    if (
      currentRankInfo.demoteCount > 0 &&
      position > totalUsers - currentRankInfo.demoteCount
    ) {
      return {
        status: 'demote',
        icon: 'arrow-down',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        label: 'Zona de Descenso',
      };
    }

    return {
      status: 'stable',
      icon: 'minus',
      color: 'text-slate-400',
      bg: 'bg-slate-800/30 border-slate-700/50',
      label: 'Zona Segura',
    };
  };

  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 flex items-center justify-center gap-3 text-4xl font-bold">
            <Icon name="trophy" className="text-yellow-400" />
            Clasificatoria Semanal
          </h1>
          <p className="text-slate-400">
            Compite con otros estudiantes y sube de rango. ¡Se actualiza cada
            lunes!
          </p>
        </div>

        {/* Rank Tabs */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-4">
          {Object.values(RANKS).map((rank) => (
            <button
              key={rank.id}
              onClick={() => setSelectedRank(rank.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 whitespace-nowrap transition-all ${
                selectedRank === rank.id
                  ? `bg-linear-to-r ${rank.color} border-transparent text-white shadow-lg`
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{rank.icon}</span>
              <span className="font-bold">{rank.label}</span>
            </button>
          ))}
        </div>

        {/* Rank Info Card */}
        <div
          className={`bg-linear-to-r ${currentRankInfo.color} mb-8 rounded-2xl p-px`}
        >
          <div className="rounded-2xl bg-slate-900/95 p-6 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div
                  className={`h-16 w-16 rounded-xl bg-linear-to-br ${currentRankInfo.color} flex items-center justify-center text-3xl shadow-lg`}
                >
                  {currentRankInfo.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {currentRankInfo.label}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {currentRankInfo.promoteCount > 0
                      ? `Top ${currentRankInfo.promoteCount} suben`
                      : 'Rango Máximo'}{' '}
                    •
                    {currentRankInfo.demoteCount > 0
                      ? ` Últimos ${currentRankInfo.demoteCount} bajan`
                      : ' Sin descenso'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-center">
                <div className="rounded-lg bg-slate-800/50 px-4 py-2">
                  <div className="text-2xl font-bold text-white">
                    {leaderboardData.length}
                  </div>
                  <div className="text-xs text-slate-400 uppercase">
                    Competidores
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center">
              <Icon
                name="spinner"
                className="mb-4 animate-spin text-4xl text-cyan-400"
              />
              <p className="text-slate-400">Cargando clasificación...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 py-12 text-center">
              <div className="mb-4 text-4xl text-red-400">⚠️</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                Error al cargar
              </h3>
              <p className="px-4 text-slate-400">
                {error?.message?.includes('index')
                  ? 'Estamos optimizando la base de datos. Por favor espera unos minutos.'
                  : 'Hubo un problema al cargar la clasificación.'}
              </p>
            </div>
          ) : leaderboardData.length > 0 ? (
            leaderboardData.map((player: LeaderboardPlayer, index: number) => {
              const isCurrentUser = user?.uid === player.id;
              const style = getPositionStyle(index, leaderboardData.length);

              return (
                <div
                  key={player.id}
                  onClick={() =>
                    router.push(
                      isCurrentUser
                        ? '/perfil'
                        : `/perfil/public?userId=${player.id}`
                    )
                  }
                  className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                    isCurrentUser
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : `${style.bg} hover:bg-slate-800`
                  }`}
                >
                  {/* Position */}
                  <div className="w-8 text-center text-lg font-bold text-slate-300">
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800">
                      <img
                        src={
                          player.photoUrl ||
                          player.profileImage ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name || player.username}`
                        }
                        alt={player.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-2 -right-1 text-lg text-yellow-400 drop-shadow-lg">
                        <Icon name="crown" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`truncate font-bold ${isCurrentUser ? 'text-cyan-400' : 'text-white'}`}
                      >
                        {player.name || player.username || 'Usuario'}
                      </h3>
                      {isCurrentUser && (
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">
                          Tú
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs ${style.color}`}
                    >
                      <Icon name={style.icon} />
                      {style.label}
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {player.weeklyXP || 0} XP
                    </div>
                    <div className="text-xs text-slate-500">Esta semana</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-12 text-center">
              <div className="mb-4 text-4xl">😴</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                ¡Está muy tranquilo por aquí!
              </h3>
              <p className="text-slate-400">
                Sé el primero en sumar puntos en la liga {currentRankInfo.label}
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
