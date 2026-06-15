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
      <body className="bg-surface text-on-surface flex min-h-dvh flex-col p-4">
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido
        </a>
        <main id="main-content" className="flex flex-1 items-center justify-center">
          <div className="max-w-md text-center">
            <p className="text-on-surface-muted mb-2 text-sm font-semibold tracking-wide uppercase" role="alert">
              Error crítico
            </p>
            <h1 className="mb-2 text-2xl font-semibold">No se pudo cargar la aplicación</h1>
            <p className="text-on-surface-muted mb-8">Intenta recargar la página o vuelve a intentarlo.</p>
            <button
              type="button"
              onClick={reset}
              className="bg-app-ring hover:bg-hub-orb focus-visible:ring-app-accent cursor-pointer rounded-lg px-6 py-3 font-semibold text-white focus-visible:ring-2 focus-visible:outline-none"
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
