'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

export const DemoRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const hydrated = useAppSelector((s) => s.uiSession.hydrated);

  useEffect(() => {
    if (!loading && hydrated && !isAuthenticated && !demoMode) router.replace('/login');
  }, [loading, hydrated, isAuthenticated, demoMode, router]);

  if (loading || !hydrated || (!isAuthenticated && !demoMode)) return null;
  return children;
};
