'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLeaderboard, type LeaderboardPlayer } from '@/hooks/gamification';
import { useMyLeague } from '@/hooks/gamification/useMyLeague';
import { useProfileStatus } from '@/features/user/hooks/useProfileStatus';
import { useResolvedProfileAvatar } from '@/features/user/hooks/useResolvedProfileAvatar';
import { useVipBadge } from '@/features/store/hooks/useVipBadge';
import { getRankInfo } from '@/shared/constants/ranks';
import { LEAGUE_GROUP_SIZE } from '@/shared/constants/gamification';
import { formatCountdownToReset } from '@/services/league/leagueWeekUtils';
import { LeagueShieldNav } from '@/features/exam/components/league/LeagueShieldNav';
import { LeagueJoinBanner } from '@/features/exam/components/league/LeagueJoinBanner';
import { LeagueSkeletonRows } from '@/features/exam/components/league/LeagueSkeletonRows';
import { LeaguePlayerRow } from '@/features/exam/components/league/LeaguePlayerRow';
import { LeaguePinnedUserRow } from '@/features/exam/components/league/LeaguePinnedUserRow';
import { EmptyState } from '@/shared/components/EmptyState';

export const ClasificatoriaPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { leagueState, leagueRank: myLeagueRank, loading: leagueLoading, resetMs } = useMyLeague();
  const { statusId } = useProfileStatus();
  const avatarSrc = useResolvedProfileAvatar(user?.profileImage);
  const hasVip = useVipBadge();

  const [selectedRank, setSelectedRank] = useState('novato');
  const { leaderboardData, loading, error, isMyLeague, refresh } = useLeaderboard(selectedRank, myLeagueRank);
  const currentRankInfo = getRankInfo(selectedRank);
  const isViewingOwnLeague = isMyLeague && selectedRank === myLeagueRank;

  useEffect(() => {
    if (myLeagueRank) setSelectedRank(myLeagueRank);
  }, [myLeagueRank]);

  const getPositionStyle = (index: number, totalUsers: number) => {
    if (!isViewingOwnLeague) {
      return {
        status: 'stable',
        icon: 'minus' as const,
        color: 'text-on-surface-muted',
        bg: 'border-surface-border/80 bg-surface-elevated/40',
        label: 'Solo referencia',
      };
    }

    const position = index + 1;

    if (currentRankInfo.promoteCount > 0 && position <= currentRankInfo.promoteCount) {
      return {
        status: 'promote',
        icon: 'arrow-up' as const,
        color: 'text-emerald-400',
        bg: 'border-emerald-500/20 bg-emerald-500/5',
        label: 'Zona de ascenso',
      };
    }

    if (currentRankInfo.demoteCount > 0 && position > totalUsers - currentRankInfo.demoteCount) {
      return {
        status: 'demote',
        icon: 'arrow-down' as const,
        color: 'text-red-400',
        bg: 'border-red-500/20 bg-red-500/5',
        label: 'Zona de descenso',
      };
    }

    return {
      status: 'stable',
      icon: 'minus' as const,
      color: 'text-on-surface-muted',
      bg: 'border-surface-border/80 bg-surface-elevated/40',
      label: 'Zona segura',
    };
  };

  const memberCount = leagueState?.memberCount ?? leaderboardData.length;
  const groupSize = leagueState?.groupSize ?? LEAGUE_GROUP_SIZE;
  const groupNumber = leagueState?.groupNumber ?? 1;
  const slotsRemaining = Math.max(0, groupSize - memberCount);
  const weeklyXp = leagueState?.weeklyXp ?? 0;
  const needsJoinCta = isViewingOwnLeague && weeklyXp === 0;
  const showLeaderboardLoading =
    isViewingOwnLeague && ((loading && leaderboardData.length === 0) || (leagueLoading && !leagueState));

  const otherPlayers = useMemo(() => {
    if (!user?.uid) return leaderboardData;
    return leaderboardData.filter((p) => p.id !== user.uid);
  }, [leaderboardData, user?.uid]);

  const currentUserInList = useMemo(
    () => leaderboardData.find((p) => p.id === user?.uid),
    [leaderboardData, user?.uid]
  );

  const displayName = currentUserInList?.name || currentUserInList?.username || user?.displayName || 'Tú';

  return (
    <div className="relative z-10 mx-auto flex min-h-[70dvh] max-w-2xl flex-col px-4 pb-4">
      <h1 className="sr-only">Clasificatoria semanal</h1>
      <LeagueShieldNav selectedRank={selectedRank} myLeagueRank={myLeagueRank} onSelect={setSelectedRank} />

      {isViewingOwnLeague ? (
        needsJoinCta ? (
          <LeagueJoinBanner rankLabel={currentRankInfo.label} />
        ) : (
          <div className="mb-5 text-center">
            <h2 className="text-lg font-bold text-white sm:text-xl">División {currentRankInfo.label}</h2>
            <p className="text-on-surface-muted mt-1 text-xs sm:text-sm">
              Grupo {groupNumber} · {memberCount}/{groupSize} competidores
              {slotsRemaining > 0 && ` · ${slotsRemaining} cupos libres`}
            </p>
            <p className="text-app-accent-muted mt-2 text-xs">
              Próximo reset:{' '}
              <span className="font-mono font-semibold text-sky-400">{formatCountdownToReset(resetMs)}</span>
            </p>
          </div>
        )
      ) : (
        !leagueLoading && (
          <div
            className={cn(
              'border-surface-border bg-surface-elevated/60 text-on-surface-muted mb-6 rounded-2xl border',
              'dark:border-surface-border dark:bg-surface-elevated/60 px-4 py-3 text-center text-sm'
            )}
          >
            No participas en la liga {currentRankInfo.label}. Estás en{' '}
            <span className="text-on-surface font-semibold">{getRankInfo(myLeagueRank).label}</span>.
          </div>
        )
      )}

      <div className="min-h-0 flex-1">
        {showLeaderboardLoading ? (
          <LoadingState label="Cargando clasificación..." layout="section" />
        ) : error ? (
          <EmptyState
            icon="exclamation-triangle"
            title="Error al cargar"
            description={
              error?.message?.includes('index') || error?.message?.includes('function')
                ? 'Ejecuta la migración de ligas en Supabase y recarga el esquema (NOTIFY pgrst).'
                : error.message || 'Hubo un problema al cargar la clasificación.'
            }
            actionLabel="Reintentar"
            onAction={() => void refresh()}
          />
        ) : isViewingOwnLeague ? (
          <div className="space-y-2">
            {needsJoinCta || leaderboardData.length <= 1 ? (
              <LeagueSkeletonRows count={Math.min(12, Math.max(8, groupSize - 1))} />
            ) : (
              otherPlayers.map((player: LeaderboardPlayer, index: number) => {
                const originalIndex = leaderboardData.findIndex((p) => p.id === player.id);
                const style = getPositionStyle(originalIndex, leaderboardData.length);
                return (
                  <LeaguePlayerRow
                    key={player.id}
                    player={player}
                    position={originalIndex + 1}
                    isCurrentUser={false}
                    style={style}
                    showCrown={originalIndex === 0}
                    onClick={() => router.push(`/perfil/public?userId=${player.id}`)}
                  />
                );
              })
            )}

            {isViewingOwnLeague && user && (
              <LeaguePinnedUserRow
                name={displayName}
                profileImage={avatarSrc ?? currentUserInList?.profileImage}
                weeklyXp={currentUserInList?.weeklyXP ?? weeklyXp}
                position={leagueState?.myPosition ?? null}
                hasVip={hasVip}
                statusId={statusId}
                onClick={() => router.push('/perfil')}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
