import type { Metadata } from 'next';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe o ha sido movida en ICFES Master.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Saltar al contenido
      </a>
      <main id="main-content" className={cn('flex flex-col items-center justify-center p-4', FULL_PAGE_SHELL_CLASS)}>
        <div className="max-w-md text-center">
          <p className="text-app-accent/80 mb-4 text-8xl leading-none font-bold" aria-hidden="true">
            404
          </p>
          <h1 className="text-on-surface mb-2 text-2xl font-semibold">Página no encontrada</h1>
          <p className="text-on-surface-muted mb-8">La página que buscas no existe o ha sido movida.</p>
          <Link
            href="/"
            className={cn(
              'from-cta-from to-cta-to inline-block rounded-lg bg-linear-to-r px-8 py-3 font-semibold',
              'text-white no-underline transition-opacity hover:opacity-90',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface'
            )}
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </>
  );
}
