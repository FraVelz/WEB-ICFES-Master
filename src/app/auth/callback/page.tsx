import { Suspense } from 'react';

import { AuthCallbackClient } from './AuthCallbackClient';

function AuthCallbackFallback() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-black via-slate-950 to-black px-6 text-white">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-app-ring/30 border-t-app-ring" />
      <p className="text-center text-slate-300">Completando inicio de sesión...</p>
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
