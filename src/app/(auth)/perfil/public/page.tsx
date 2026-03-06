'use client';
import { Suspense } from 'react';
import { PerfilPublico } from '@/features/user/pages';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center"><div className="animate-spin text-4xl text-cyan-400">...</div></div>}>
      <PerfilPublico />
    </Suspense>
  );
}
