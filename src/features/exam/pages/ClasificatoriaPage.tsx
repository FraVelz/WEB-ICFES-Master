'use client';
import { cn } from '@/utils/cn';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLeaderboard, type LeaderboardPlayer } from '@/hooks/gamification';
import { useMyLeague } from '@/hooks/gamification/useMyLeague';
import { RANKS, getRankInfo } from '@/shared/constants/ranks';
import { LEAGUE_GROUP_SIZE } from '@/shared/constants/gamification';
import { formatCountdownToReset } from '@/services/league/leagueWeekUtils';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { VIP_AVATAR_BORDER_CLASS } from '@/features/store/constants/vipBadge';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const ClasificatoriaPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { leagueState, leagueRank: myLeagueRank, loading: leagueLoading, resetMs } = useMyLeague();

  const [selectedRank, setSelectedRank] = useState('novato');
  const { leaderboardData, loading, error, isMyLeague } = useLeaderboard(selectedRank, myLeagueRank);
  const currentRankInfo = getRankInfo(selectedRank);
  const isViewingOwnLeague = isMyLeague && selectedRank === myLeagueRank;

  useEffect(() => {
    if (myLeagueRank) {
      setSelectedRank(myLeagueRank);
    }
  }, [myLeagueRank]);

  const getPositionStyle = (index: number, totalUsers: number) => {
    if (!isViewingOwnLeague) {
      return {
        status: 'stable',
        icon: 'minus' as const,
        color: 'text-on-surface-muted',
        bg: 'border-surface-border bg-surface-elevated/80 dark:border-slate-700/50 dark:bg-slate-800/30',
        label: 'Solo referencia',
      };
    }

    const position = index + 1;

    if (currentRankInfo.promoteCount > 0 && position <= currentRankInfo.promoteCount) {
      return {
        status: 'promote',
        icon: 'arrow-up' as const,
        color: 'text-green-700 dark:text-green-400',
        bg: 'border-green-600/35 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10',
        label: 'Zona de Ascenso',
      };
    }

    if (currentRankInfo.demoteCount > 0 && position > totalUsers - currentRankInfo.demoteCount) {
      return {
        status: 'demote',
        icon: 'arrow-down' as const,
        color: 'text-red-700 dark:text-red-400',
        bg: 'border-red-600/35 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10',
        label: 'Zona de Descenso',
      };
    }

    return {
      status: 'stable',
      icon: 'minus' as const,
      color: 'text-on-surface-muted',
      bg: 'border-surface-border bg-surface-elevated/80 dark:border-slate-700/50 dark:bg-slate-800/30',
      label: 'Zona Segura',
    };
  };

  const memberCount = leagueState?.memberCount ?? leaderboardData.length;
  const groupSize = leagueState?.groupSize ?? LEAGUE_GROUP_SIZE;
  const groupNumber = leagueState?.groupNumber ?? 1;
  const slotsRemaining = Math.max(0, groupSize - memberCount);
  const showLeaderboardLoading =
    isViewingOwnLeague && ((loading && leaderboardData.length === 0) || (leagueLoading && !leagueState));

  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-purple-900/20 to-transparent"></div>
        <div className="bg-app-ring/10 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 flex items-center justify-center gap-3 text-4xl font-bold">
            <Icon name="trophy" className="text-amber-600 dark:text-yellow-400" />
            Clasificatoria Semanal
          </h1>
          <p className="text-on-surface-muted">
            Compite en tu grupo de {groupSize} y sube de liga. ¡Se actualiza cada lunes!
          </p>
          {isViewingOwnLeague && (
            <p className="text-app-accent-muted mt-2 text-sm">
              Próximo reset:{' '}
              <span className="text-app-accent font-mono font-semibold">{formatCountdownToReset(resetMs)}</span>
            </p>
          )}
        </div>

        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-4">
          {Object.values(RANKS).map((rank) => {
            const isActiveLeague = rank.id === myLeagueRank;
            return (
              <button
                key={rank.id}
                onClick={() => setSelectedRank(rank.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 whitespace-nowrap transition-all',
                  selectedRank === rank.id
                    ? cn(`bg-linear-to-r ${rank.color}`, 'border-transparent text-white shadow-lg')
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800',
                  isActiveLeague && selectedRank !== rank.id && 'ring-app-ring/40 ring-1'
                )}
              >
                <Icon name={rank.icon} size="md" className="shrink-0" />
                <span className="font-bold">{rank.label}</span>
                {isActiveLeague && <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[10px]">Tú</span>}
              </button>
            );
          })}
        </div>

        <div className={cn('mb-8 rounded-2xl p-px', `bg-linear-to-r ${currentRankInfo.color}`)}>
          <div className="bg-surface-elevated/95 rounded-2xl p-6 backdrop-blur-xl dark:bg-slate-900/95">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-xl text-white shadow-lg',
                    `bg-linear-to-br ${currentRankInfo.color}`
                  )}
                >
                  <Icon name={currentRankInfo.icon} size="2xl" />
                </div>
                <div>
                  <h2 className="text-on-surface text-2xl font-bold">{currentRankInfo.label}</h2>
                  <p className="text-on-surface-muted text-sm">
                    {currentRankInfo.promoteCount > 0 ? `Top ${currentRankInfo.promoteCount} suben` : 'Rango Máximo'} •
                    {currentRankInfo.demoteCount > 0
                      ? ` Últimos ${currentRankInfo.demoteCount} bajan`
                      : ' Sin descenso'}
                  </p>
                  {isViewingOwnLeague && (
                    <p className="text-on-surface-muted/80 mt-1 text-xs">
                      Grupo {groupNumber} · {memberCount}/{groupSize} competidores
                      {slotsRemaining > 0 && ` · faltan ${slotsRemaining} para llenar el grupo`}
                    </p>
                  )}
                </div>
              </div>

              {isViewingOwnLeague && (
                <div className="flex gap-4 text-center">
                  <div className="border-surface-border bg-surface-elevated rounded-lg border px-4 py-2 dark:border-transparent dark:bg-slate-800/50">
                    <div className="text-on-surface text-2xl font-bold">{leagueState?.myPosition ?? '—'}</div>
                    <div className="text-on-surface-muted text-xs uppercase">Tu posición</div>
                  </div>
                  <div className="border-surface-border bg-surface-elevated rounded-lg border px-4 py-2 dark:border-transparent dark:bg-slate-800/50">
                    <div className="text-on-surface text-2xl font-bold">{leagueState?.weeklyXp ?? 0}</div>
                    <div className="text-on-surface-muted text-xs uppercase">Tu XP semanal</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isViewingOwnLeague && !leagueLoading && (
          <div className="border-surface-border bg-surface-elevated/60 text-on-surface-muted mb-6 rounded-xl border px-4 py-3 text-center text-sm dark:border-slate-700 dark:bg-slate-900/60">
            No participas en la liga {currentRankInfo.label}. Estás en{' '}
            <span className="text-on-surface font-semibold">{getRankInfo(myLeagueRank).label}</span>. Aquí solo ves las
            reglas de esta liga.
          </div>
        )}

        <div className="space-y-3">
          {showLeaderboardLoading ? (
            <LoadingState label="Cargando clasificación..." layout="section" />
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 py-12 text-center">
              <Icon name="exclamation-triangle" size="3xl" className="mx-auto mb-4 text-red-400" />
              <h3 className="mb-2 text-xl font-bold text-white">Error al cargar</h3>
              <p className="px-4 text-slate-400">
                {error?.message?.includes('index') || error?.message?.includes('function')
                  ? 'Ejecuta la migración de ligas en Supabase y recarga el esquema (NOTIFY pgrst).'
                  : error.message || 'Hubo un problema al cargar la clasificación.'}
              </p>
            </div>
          ) : isViewingOwnLeague && leaderboardData.length > 0 ? (
            leaderboardData.map((player: LeaderboardPlayer, index: number) => {
              const isCurrentUser = user?.uid === player.id;
              const isVip = Boolean(player.hasVipBadge);
              const style = getPositionStyle(index, leaderboardData.length);

              return (
                <div
                  key={player.id}
                  onClick={() => router.push(isCurrentUser ? '/perfil' : `/perfil/public?userId=${player.id}`)}
                  className={cn(
                    'group relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all',
                    isCurrentUser
                      ? 'border-app-ring/50 dark:bg-app-ring/10 dark:shadow-app-ring/10 bg-cyan-50 shadow-sm dark:shadow-lg'
                      : cn(style.bg, 'hover:bg-surface-elevated dark:hover:bg-slate-800')
                  )}
                >
                  <div className="text-on-surface w-8 text-center text-lg font-bold">{index + 1}</div>

                  <div className="relative">
                    <div
                      className={cn(
                        'bg-surface-elevated relative h-12 w-12 overflow-hidden rounded-full border-2 dark:bg-slate-800',
                        isVip ? VIP_AVATAR_BORDER_CLASS : 'border-surface-border dark:border-slate-700'
                      )}
                    >
                      <AvatarImage src={player.profileImage} alt={player.name || player.username || 'Jugador'} />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-2 -right-1 text-lg text-amber-600 drop-shadow-lg dark:text-yellow-400">
                        <Icon name="crown" />
                      </div>
                    )}
                    {isVip && index !== 0 && (
                      <div
                        className="absolute -top-1.5 -right-1 text-sm text-amber-600 drop-shadow-lg dark:text-yellow-400"
                        title="Insignia VIP"
                      >
                        <Icon name="crown" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          'truncate font-bold',
                          isCurrentUser ? 'text-app-accent-strong dark:text-app-accent' : 'text-on-surface'
                        )}
                      >
                        {player.name || player.username || 'Usuario'}
                      </h3>
                      {isVip && (
                        <span
                          className="flex items-center gap-0.5 rounded-full border border-amber-600/35 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:border-yellow-500/40 dark:bg-yellow-500/15 dark:text-yellow-400"
                          title="Insignia VIP"
                        >
                          <Icon name="crown" size="sm" />
                          VIP
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="border-app-ring/40 bg-app-ring/15 text-app-accent-strong dark:text-app-accent-muted rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                          Tú
                        </span>
                      )}
                    </div>
                    <div className={cn('flex items-center gap-1 text-xs', style.color)}>
                      <Icon name={style.icon} />
                      {style.label}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-on-surface text-xl font-bold">{player.weeklyXP || 0} XP</div>
                    <div className="text-on-surface-muted text-xs">Esta semana</div>
                  </div>
                </div>
              );
            })
          ) : isViewingOwnLeague ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-12 text-center">
              <Icon name="moon" size="3xl" className="mx-auto mb-4 text-slate-400" />
              <h3 className="mb-2 text-xl font-bold text-white">¡Está muy tranquilo por aquí!</h3>
              <p className="text-slate-400">
                Sé el primero en sumar puntos en tu grupo de {currentRankInfo.label}.
                {slotsRemaining > 0 && ` Faltan ${slotsRemaining} estudiantes para completar el grupo.`}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
