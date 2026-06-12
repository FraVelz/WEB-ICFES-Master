'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ROUTE_TO_500_PATH, ROUTE_TO_500_STEPS } from '@/features/learning/data/routeTo500';

export function LecturaRutaAl500Section() {
  return (
    <section
      id="ruta-al-500"
      aria-labelledby="ruta-500-title"
      className={cn(
        'border-surface-border bg-surface-elevated/60 rounded-2xl border p-4 sm:p-5',
        'from-app-accent/5 bg-linear-to-br to-transparent'
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className={cn(
            'bg-app-accent/15 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
          )}
          aria-hidden
        >
          <Icon name="map" className="text-lg" />
        </div>
        <div className="min-w-0">
          <h2 id="ruta-500-title" className="text-on-surface text-lg font-bold">
            Ruta al 500
          </h2>
          <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">
            Avanza por competencias (ND 1–4), no por memorizar datos. Cinco pasos: tres fases de aprendizaje, simulacro
            por materia y examen global.
          </p>
        </div>
      </div>

      <ol className="space-y-1.5" aria-label="Resumen de pasos">
        {ROUTE_TO_500_STEPS.map((step) => (
          <li key={step.id} className="text-on-surface-muted flex items-center gap-2 text-xs sm:text-sm">
            <span className="bg-app-accent/15 text-app-accent flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold">
              {step.order}
            </span>
            <span className="text-on-surface font-medium">{step.title}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={ROUTE_TO_500_PATH}
          className={cn(
            'bg-app-accent inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
            'focus-visible:ring-app-accent transition-colors hover:brightness-110 focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ver la ruta completa
        </Link>
        <Link
          href="/ruta-aprendizaje?etapa=facil"
          className={cn(
            'border-surface-border text-on-surface-muted inline-flex flex-1 items-center justify-center rounded-xl border',
            'hover:text-on-surface hover:bg-surface-via px-4 py-2.5 text-sm font-semibold transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ir a aprendizaje
        </Link>
      </div>
    </section>
  );
}
