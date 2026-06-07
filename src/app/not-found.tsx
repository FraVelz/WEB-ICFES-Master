import { cn } from '@/utils/cn';
import Link from 'next/link';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export default function NotFound() {
  return (
    <div className={cn('flex flex-col items-center justify-center p-4', FULL_PAGE_SHELL_CLASS)}>
      <div className="max-w-md text-center">
        <h1 className="text-app-accent/80 mb-4 text-8xl leading-none font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-on-surface">Página no encontrada</h2>
        <p className="mb-8 text-on-surface-muted">La página que buscas no existe o ha sido movida.</p>
        <Link
          href="/"
          className={cn(
            'from-cta-from to-cta-to inline-block rounded-lg bg-linear-to-r px-8 py-3 font-semibold',
            'text-white no-underline transition-opacity hover:opacity-90'
          )}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
