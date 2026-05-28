import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

export const FinalCTASection = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center md:px-8">
      <div className="border-app-ring/50 from-app-accent-strong/30 rounded-xl border bg-linear-to-r via-purple-600/30 to-pink-600/30 p-12 md:p-16">
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">¿Listo para sacar 500?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
          Miles de estudiantes ya están preparándose. Cada día que esperes es un día menos de preparación.
        </p>
        <Link
          href="/dashboard"
          className={cn(
            'from-cta-from to-cta-to inline-flex items-center gap-2 rounded-lg bg-linear-to-r px-10',
            'py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105',
            'hover:shadow-app-ring/50 hover:shadow-lg',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950/80'
          )}
        >
          <Icon name="rocket" />
          Comienza tu Preparación Gratis
        </Link>
      </div>
    </section>
  );
};
