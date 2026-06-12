import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ROUTE_TO_500_PATH, ROUTE_TO_500_STEPS } from '@/features/learning/data/routeTo500';
import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';

export function RouteTo500TeaserSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Tu camino al 500</h2>
        <p className="text-on-surface-muted mx-auto max-w-2xl text-lg">
          Preparación por competencias ICFES (ND 1–4), no por memorizar fechas. Cinco pasos: aprendizaje guiado,
          simulacros por materia y examen global.
        </p>
      </div>

      <ol className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ROUTE_TO_500_STEPS.map((step) => (
          <li
            key={step.id}
            className={cn(
              'border-surface-border bg-surface-elevated/60 rounded-xl border p-4 text-center',
              'from-app-accent/5 bg-linear-to-br to-transparent'
            )}
          >
            <span className="bg-app-accent/20 text-app-accent mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
              {step.order}
            </span>
            <p className="text-on-surface text-sm font-semibold">{step.title.replace('Fase de ', '')}</p>
            <p className="text-on-surface-muted mt-1 text-xs">{step.performanceLevels}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={ROUTE_TO_500_PATH}
          className={cn(
            'bg-app-accent inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white',
            'focus-visible:ring-app-accent transition-colors hover:brightness-110 focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Conoce la ruta al 500
        </Link>
        <Link
          href={buildLevelAssessmentUrl('demo')}
          className={cn(
            'border-surface-border text-on-surface-muted inline-flex items-center justify-center rounded-xl border px-6 py-3',
            'hover:text-on-surface hover:bg-surface-via text-sm font-semibold transition-colors',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <Icon name="clipboard-list" className="mr-2" />
          Evaluación de nivel
        </Link>
      </div>
    </section>
  );
}
