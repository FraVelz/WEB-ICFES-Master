'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

import SignInRequiredBlock from './SignInRequiredBlock';

type ProtectedPageProps = {
  children: React.ReactNode;
  /** When true, demo mode without auth shows SignInRequiredBlock instead of content */
  blockDemoContent?: boolean;
};

export default function ProtectedPage({ children, blockDemoContent = true }: ProtectedPageProps) {
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
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-app-ring/30 border-t-app-ring" />
          <p className="text-lg font-semibold text-app-accent">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && demoMode && blockDemoContent) {
    return <SignInRequiredBlock />;
  }

  if (!isAuthenticated && !demoMode) return null;

  return <>{children}</>;
}
