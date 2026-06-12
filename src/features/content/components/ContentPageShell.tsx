'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { DashboardLayoutChrome } from '@/features/dashboard/shell/DashboardLayoutChrome';
import { LevelAssessmentGate } from '@/components/LevelAssessmentGate';
import { cn } from '@/utils/cn';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import Link from 'next/link';

export type ContentVariant = 'public' | 'full';

const ContentVariantContext = createContext<ContentVariant>('public');

export function useContentVariant(): ContentVariant {
  return useContext(ContentVariantContext);
}

function PublicContentChrome({ children }: { children: ReactNode }) {
  return (
    <div className={cn(FULL_PAGE_SHELL_CLASS, 'relative')}>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <header className="border-surface-border bg-surface-elevated/90 sticky top-0 z-30 border-b px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/" className="text-on-surface text-sm font-bold">
            ICFES Master
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/login/" className="text-app-accent font-semibold">
              Iniciar sesión
            </Link>
            <Link
              href="/signup/"
              className="bg-app-accent rounded-lg px-3 py-1.5 text-xs font-bold text-white"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="relative z-10 py-8">
        {children}
      </main>
    </div>
  );
}

function PublicContentCta() {
  return (
    <aside className="border-app-ring/25 bg-app-ring/10 mx-auto mt-10 max-w-4xl rounded-2xl border p-6 text-center">
      <p className="text-on-surface mb-4 text-sm leading-relaxed">
        Crea una cuenta gratis para ver guías completas, infografías interactivas y seguir tu progreso de lectura.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup/"
          className="from-cta-from to-cta-to rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-bold text-white"
        >
          Registrarme
        </Link>
        <Link href="/login/" className="text-app-accent text-sm font-semibold underline">
          Ya tengo cuenta
        </Link>
      </div>
    </aside>
  );
}

export function ContentPageShell({ children }: { children: ReactNode }) {
  const { isAccountAuth, loading } = useAuth();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);

  const hasAppAccess = demoMode || isAccountAuth;
  const variant: ContentVariant = !loading && hydrated && hasAppAccess ? 'full' : 'public';

  if (variant === 'full') {
    return (
      <ContentVariantContext.Provider value="full">
        <div className="from-surface via-surface-via to-surface text-on-surface relative flex min-h-dvh bg-linear-to-b">
          <LevelAssessmentGate />
          <DashboardLayoutChrome>{children}</DashboardLayoutChrome>
        </div>
      </ContentVariantContext.Provider>
    );
  }

  return (
    <ContentVariantContext.Provider value="public">
      <PublicContentChrome>
        {children}
        <PublicContentCta />
      </PublicContentChrome>
    </ContentVariantContext.Provider>
  );
}
