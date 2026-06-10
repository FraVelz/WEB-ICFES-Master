'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LeagueSupabaseService, type MyLeagueState } from '@/services/league';
import { getMsUntilNextMondayReset } from '@/services/league/leagueWeekUtils';

export const useMyLeague = () => {
  const { user } = useAuth();
  const [leagueState, setLeagueState] = useState<MyLeagueState | null>(null);
  const [resetMs, setResetMs] = useState(() => getMsUntilNextMondayReset());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setLeagueState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const state = await LeagueSupabaseService.getMyLeagueState();
      setLeagueState(state);
      setResetMs(getMsUntilNextMondayReset());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error cargando liga'));
      setLeagueState(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResetMs(getMsUntilNextMondayReset());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return {
    leagueState,
    leagueRank: leagueState?.leagueRank ?? 'novato',
    loading,
    error,
    resetMs,
    refresh: load,
  };
};
