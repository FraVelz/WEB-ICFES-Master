'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { fetchPhaseSkipAvailability, type PhaseSkipAvailabilityResponse } from './phaseSkipClient';

export function usePhaseSkipAvailability(lessonIds: string[]) {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<PhaseSkipAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessonKey = lessonIds.join(',');

  useEffect(() => {
    if (!lessonIds.length || !user || isDemoUserId(user.uid)) {
      setAvailability(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void fetchPhaseSkipAvailability(lessonIds)
      .then((data) => {
        if (!active) return;
        setAvailability(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'No se pudo consultar disponibilidad');
        setAvailability(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessonKey, lessonIds, user?.uid]);

  return { availability, loading, error, canStart: availability?.canStart ?? false };
}
