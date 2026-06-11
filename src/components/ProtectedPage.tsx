'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/utils/cn';

import { useUiSessionStore } from '@/store/uiSessionStore';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

import { LoadingState } from '@/shared/components/LoadingState';
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
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);

  const hasAccess = demoMode || isAccountAuth;

  useEffect(() => {
    if (!loading && hydrated && !hasAccess) {
      router.replace('/login');
    }
  }, [loading, hydrated, hasAccess, router]);

  if (loading || !hydrated) {
    return (
      <div className={cn('flex flex-col items-center justify-center', FULL_PAGE_SHELL_CLASS)}>
        <LoadingState label="Verificando sesión..." layout="fill" />
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
