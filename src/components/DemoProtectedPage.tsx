'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

export default function DemoProtectedPage({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const hydrated = useAppSelector((s) => s.uiSession.hydrated);

  useEffect(() => {
    if (!loading && hydrated && !isAuthenticated && !demoMode) {
      router.replace('/login');
    }
  }, [loading, hydrated, isAuthenticated, demoMode, router]);

  if (loading || !hydrated) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-black via-slate-950 to-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
          <p className="text-lg font-semibold text-cyan-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !demoMode) return null;

  return <>{children}</>;
}
