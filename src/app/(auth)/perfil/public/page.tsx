'use client';
import { Suspense } from 'react';
import { PerfilPublico } from '@/features/user/pages';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-slate-950">
          <div className="animate-spin text-4xl text-cyan-400">...</div>
        </div>
      }
    >
      <PerfilPublico />
    </Suspense>
  );
}
