'use client';

import { useEffect } from 'react';

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
      <body className="flex min-h-dvh items-center justify-center bg-slate-950 p-4 text-white">
        <div className="max-w-md text-center" role="alert">
          <h1 className="mb-2 text-2xl font-semibold">Error crítico</h1>
          <p className="mb-8 text-slate-400">No se pudo cargar la aplicación. Intenta recargar la página.</p>
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
