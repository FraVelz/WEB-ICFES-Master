import type { ReactNode } from 'react';

export function ProfilePageLayout({
  children,
  glowVariant = 'default',
}: {
  children: ReactNode;
  glowVariant?: 'default' | 'public';
}) {
  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {glowVariant === 'public' ? (
          <>
            <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-purple-900/20 to-transparent" />
            <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-app-ring/10 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-hub-sheet-from/20 to-transparent" />
            <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          </>
        )}
      </div>
      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
