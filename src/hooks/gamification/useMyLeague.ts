'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LeagueSupabaseService } from '@/services/league';
import { getMsUntilNextMondayReset } from '@/services/league/leagueWeekUtils';
import { queryKeys } from '@/services/query/queryKeys';

export const useMyLeague = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resetMs, setResetMs] = useState(() => getMsUntilNextMondayReset());

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: queryKeys.league(user?.uid ?? ''),
    queryFn: () => LeagueSupabaseService.getMyLeagueState(),
    enabled: !!user?.uid,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setResetMs(getMsUntilNextMondayReset());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const refresh = useCallback(async () => {
    if (!user?.uid) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.league(user.uid) });
  }, [queryClient, user?.uid]);

  return {
    leagueState: data ?? null,
    leagueRank: data?.leagueRank ?? 'novato',
    loading: isLoading && data == null,
    error: error instanceof Error ? error : error ? new Error('Error cargando liga') : null,
    resetMs,
    refresh,
    isFetching,
  };
};
