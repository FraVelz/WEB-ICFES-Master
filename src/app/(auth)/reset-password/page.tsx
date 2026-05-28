import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-950">
          <div className="text-app-accent animate-spin text-4xl">...</div>
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
