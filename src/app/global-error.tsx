'use client';

import { useEffect } from 'react';
import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[app/global-error]', error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-surface text-on-surface flex min-h-dvh items-center justify-center p-4">
        <div className="max-w-md text-center" role="alert">
          <h1 className="mb-2 text-2xl font-semibold">Error crítico</h1>
          <p className="text-on-surface-muted mb-8">No se pudo cargar la aplicación. Intenta recargar la página.</p>
          <button
            type="button"
            onClick={reset}
            className="bg-app-ring hover:bg-hub-orb cursor-pointer rounded-lg px-6 py-3 font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
