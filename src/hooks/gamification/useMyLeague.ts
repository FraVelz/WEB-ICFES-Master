'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LeagueSupabaseService, type MyLeagueState } from '@/services/league';
import { getMsUntilNextMondayReset } from '@/services/league/leagueWeekUtils';

export const useMyLeague = () => {
  const { user } = useAuth();
  const [leagueState, setLeagueState] = useState<MyLeagueState | null>(null);
  const leagueStateRef = useRef<MyLeagueState | null>(null);
  const [resetMs, setResetMs] = useState(() => getMsUntilNextMondayReset());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setLeagueState(null);
      leagueStateRef.current = null;
      setLoading(false);
      return;
    }

    if (!leagueStateRef.current) {
      setLoading(true);
    }
    setError(null);
    try {
      const state = await LeagueSupabaseService.getMyLeagueState();
      leagueStateRef.current = state;
      setLeagueState(state);
      setResetMs(getMsUntilNextMondayReset());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error cargando liga'));
      leagueStateRef.current = null;
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
