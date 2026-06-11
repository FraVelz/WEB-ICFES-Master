'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ensureLearningProgressSynced } from '@/services/learning';

/** Sincroniza lecciones completadas y saltos de fase con Supabase al iniciar sesión. */
export function LearningProgressHydrator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?.uid) return;
    void ensureLearningProgressSynced(user.uid);
  }, [user?.uid, loading]);

  return null;
}
