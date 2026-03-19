'use client';
import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth/pages';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-slate-950 flex items-center justify-center"><div className="animate-spin text-4xl text-cyan-400">...</div></div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
