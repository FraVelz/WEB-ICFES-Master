import { Suspense } from 'react';
import { cn } from '@/utils/cn';

import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

import { AuthCallbackClient } from './_components/AuthCallbackClient';

function AuthCallbackFallback() {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6', FULL_PAGE_SHELL_CLASS)}>
      <div className="border-app-ring/30 border-t-app-ring mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4" />
      <p className="text-on-surface-muted text-center">Completando inicio de sesión...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}
