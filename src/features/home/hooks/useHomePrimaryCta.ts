'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/AuthContext';
import { redirectAfterAuth } from '@/features/auth/utils/loginRedirect';
import { enterDemoModeWithAssessment } from '@/features/home/utils/enterDemoMode';
import type { IconName } from '@/shared/components/Icon/Icon';

export function useHomePrimaryCta() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isContinuing, setIsContinuing] = useState(false);

  const handlePrimaryCta = useCallback(() => {
    if (authLoading || isContinuing) return;

    if (isAuthenticated && user?.uid) {
      setIsContinuing(true);
      void redirectAfterAuth(user.uid, (path) => router.push(path));
      return;
    }

    enterDemoModeWithAssessment();
  }, [authLoading, isAuthenticated, isContinuing, router, user?.uid]);

  const primaryLabel = isAuthenticated ? 'Continuar' : 'Probar Demo';
  const primaryIcon: IconName = isAuthenticated ? 'arrow-right' : 'play';
  const isPrimaryBusy = authLoading || isContinuing;

  return {
    authLoading,
    isContinuing,
    isPrimaryBusy,
    primaryLabel,
    primaryIcon,
    handlePrimaryCta,
  };
}
