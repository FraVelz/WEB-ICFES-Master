'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[app/error]', error);
  }, [error]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Saltar al contenido
      </a>
      <main id="main-content" className={cn('flex flex-col items-center justify-center p-4', FULL_PAGE_SHELL_CLASS)}>
        <div className="max-w-md text-center" role="alert">
          <h1 className="text-on-surface mb-2 text-2xl font-semibold">Algo salió mal</h1>
          <p className="text-on-surface-muted mb-8">
            Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className={cn(
                'from-cta-from to-cta-to cursor-pointer rounded-lg bg-linear-to-r px-6 py-3',
                'font-semibold text-white transition-opacity hover:opacity-90'
              )}
            >
              Reintentar
            </button>
            <Link
              href="/"
              className={cn(
                'border-surface-border text-on-surface rounded-lg border px-6 py-3 font-semibold',
                'hover:bg-surface-elevated no-underline transition-colors'
              )}
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
