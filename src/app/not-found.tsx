import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className={cn(
        'flex min-h-dvh flex-col items-center justify-center',
        'bg-linear-to-b from-black via-slate-900 to-black p-4 text-white'
      )}
    >
      <div className="max-w-md text-center">
        <h1 className="text-app-accent/80 mb-4 text-8xl leading-none font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Página no encontrada</h2>
        <p className="mb-8 text-slate-400">La página que buscas no existe o ha sido movida.</p>
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
