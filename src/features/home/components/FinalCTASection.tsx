import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const FinalCTASection = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center md:px-8">
      <div
        className={cn(
          'border-surface-border bg-surface-elevated relative overflow-hidden rounded-xl border p-12 shadow-md md:p-16',
          'dark:border-app-ring/30 dark:from-surface-elevated dark:via-surface-elevated dark:bg-linear-to-br',
          'dark:to-cyan-950/50 dark:shadow-none'
        )}
      >
        <div className="from-cta-from to-cta-to absolute inset-x-0 top-0 h-1 bg-linear-to-r" aria-hidden />
        <h2 className="text-on-surface mb-6 text-4xl font-bold md:text-5xl">¿Listo para sacar 500?</h2>
        <p className="text-on-surface-muted mx-auto mb-8 max-w-2xl text-lg font-medium">
          Miles de estudiantes ya están preparándose. Cada día que esperes es un día menos de preparación.
        </p>
        <Link
          href="/dashboard"
          className={cn(
            'from-cta-from to-cta-to inline-flex items-center gap-2 rounded-lg bg-linear-to-r px-10',
            'py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105',
            'hover:shadow-app-ring/50 hover:shadow-lg',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
          )}
        >
          <Icon name="rocket" />
          Comienza tu Preparación Gratis
        </Link>
      </div>
    </section>
  );
};
