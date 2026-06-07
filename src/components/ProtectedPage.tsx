'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/utils/cn';

import { useAppSelector } from '@/store/hooks';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

import SignInRequiredBlock from './SignInRequiredBlock';

type ProtectedPageProps = {
  children: React.ReactNode;
  /** Si true, modo demo ve pantalla de cuenta requerida en lugar del contenido */
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

  const hasAccess = demoMode || isAccountAuth;

  useEffect(() => {
    if (!loading && hydrated && !hasAccess) {
      router.replace('/login');
    }
  }, [loading, hydrated, hasAccess, router]);

  if (loading || !hydrated) {
    return (
      <div className={cn('flex flex-col items-center justify-center', FULL_PAGE_SHELL_CLASS)}>
        <div className="text-center">
          <div className="border-app-ring/30 border-t-app-ring mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4" />
          <p className="text-app-accent text-lg font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  if (blockDemoContent && demoMode) {
    return <SignInRequiredBlock title={authGateTitle} message={authGateMessage} />;
  }

  return <>{children}</>;
}
