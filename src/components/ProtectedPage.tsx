'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';

import SignInRequiredBlock from './SignInRequiredBlock';

type ProtectedPageProps = {
  children: React.ReactNode;
  /** Si true, en modo demo se muestra pantalla de cuenta; sin sesión redirige a login */
  blockDemoContent?: boolean;
  authGateTitle?: string;
  authGateMessage?: string;
};

export default function ProtectedPage({
  children,
  blockDemoContent = true,
  authGateTitle,
  authGateMessage,
}: ProtectedPageProps) {
  const { isAccountAuth, loading } = useAuth();
  const router = useRouter();
  const demoMode = useAppSelector((s) => s.uiSession.demoMode);
  const hydrated = useAppSelector((s) => s.uiSession.hydrated);

  useEffect(() => {
    if (!loading && hydrated && blockDemoContent && !demoMode && !isAccountAuth) {
      router.replace('/login');
    }
  }, [loading, hydrated, blockDemoContent, isAccountAuth, demoMode, router]);

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

  if (blockDemoContent && demoMode) {
    return <SignInRequiredBlock title={authGateTitle} message={authGateMessage} />;
  }

  if (blockDemoContent && !isAccountAuth) {
    return null;
  }

  return <>{children}</>;
}
