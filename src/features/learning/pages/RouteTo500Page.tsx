'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDashboardShellOptional } from '@/features/dashboard/shell';
import type { AreaId } from '@/shared/constants';
import { LecturaSectionShell } from '@/features/lectura/components/LecturaSectionShell';
import { LECTURA_PAGE_SHELL_CLASS } from '@/features/lectura/constants';
import { RouteTo500AreaMatrix } from '@/features/learning/components/routeTo500/RouteTo500AreaMatrix';
import { RouteTo500ClaritySection } from '@/features/learning/components/routeTo500/RouteTo500ClaritySection';
import { RouteTo500StepCard } from '@/features/learning/components/routeTo500/RouteTo500StepCard';
import {
  JOURNEY_TIPS,
  ROUTE_TO_500_DISCLAIMER,
  ROUTE_TO_500_STEPS,
  getJourneyStepById,
  getJourneyStepHref,
  getRecommendedStepHref,
} from '@/features/learning/data/routeTo500';
import { useJourneyRecommendation } from '@/features/learning/hooks/useJourneyRecommendation';
import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { useAuth } from '@/features/auth/context/AuthContext';

export function RouteTo500Page() {
  const shell = useDashboardShellOptional();
  const areaId: AreaId = (shell?.currentArea as AreaId | undefined) ?? 'lectura-critica';
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const { level, stepId, message, loading } = useJourneyRecommendation();

  const recommendedHref = level ? getRecommendedStepHref(level, areaId) : null;
  const recommendedStep = stepId ? getJourneyStepById(stepId) : null;
  const assessmentHref = buildLevelAssessmentUrl(demoMode && !user ? 'demo' : 'account');

  return (
    <div className={cn(LECTURA_PAGE_SHELL_CLASS, 'max-w-3xl space-y-6')}>
      <LecturaSectionShell sectionId="ruta-al-500">
        <header className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="bg-app-accent/15 text-app-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              aria-hidden
            >
              <Icon name="map" className="text-xl" />
            </div>
            <div className="min-w-0">
              <h1 className="text-on-surface text-2xl font-bold sm:text-3xl">Ruta al 500</h1>
              <p className="text-on-surface-muted mt-2 leading-relaxed">
                El puntaje ICFES no sube de golpe: avanzas por etapas de competencias, no por acumular datos de
                memoria. Cada paso tiene un marco ICFES (Niveles de desempeño), un rango orientativo de puntaje y un
                módulo concreto en la app.
              </p>
            </div>
          </div>
        </header>

        {!loading && message && recommendedStep ? (
          <div
            className={cn(
              'border-app-accent/30 bg-app-accent/10 rounded-2xl border px-4 py-3 sm:px-5',
              'text-on-surface text-sm leading-relaxed'
            )}
          >
            <p className="font-semibold">{message}</p>
            {recommendedHref ? (
              <Link
                href={recommendedHref}
                className={cn(
                  'text-app-accent mt-2 inline-flex items-center gap-1 font-bold underline-offset-2 hover:underline',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                Ir a {recommendedStep.title}
                <Icon name="arrow-right" className="text-xs" />
              </Link>
            ) : null}
          </div>
        ) : !loading && !level ? (
          <div className="border-surface-border bg-surface-elevated/60 rounded-2xl border px-4 py-3 sm:px-5">
            <p className="text-on-surface-muted text-sm leading-relaxed">
              ¿No sabes por dónde empezar? Completa la evaluación de nivel para recibir una recomendación personalizada.
            </p>
            <Link
              href={assessmentHref}
              className={cn(
                'bg-app-accent mt-3 inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white',
                'hover:brightness-110 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              Evaluación de nivel
            </Link>
          </div>
        ) : null}

        <section aria-labelledby="route-steps-title">
          <h2 id="route-steps-title" className="text-on-surface mb-3 text-lg font-bold">
            Los 5 pasos del recorrido
          </h2>
          <ol className="space-y-3">
            {ROUTE_TO_500_STEPS.map((step) => (
              <RouteTo500StepCard key={step.id} step={step} areaId={areaId} />
            ))}
          </ol>
          <p className="text-on-surface-muted mt-4 text-xs leading-relaxed">{ROUTE_TO_500_DISCLAIMER}</p>
        </section>

        <RouteTo500ClaritySection />

        <RouteTo500AreaMatrix />

        <section aria-labelledby="route-tips-title" className="space-y-3">
          <h2 id="route-tips-title" className="text-on-surface text-lg font-bold">
            Consejos clave del recorrido
          </h2>
          <ul className="space-y-2">
            {JOURNEY_TIPS.map((tip) => (
              <li
                key={tip}
                className="border-surface-border/70 bg-surface-via/50 text-on-surface-muted rounded-xl border px-3 py-2.5 text-sm leading-relaxed"
              >
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="route-exam-day-title"
          className="border-surface-border bg-surface-elevated/60 rounded-2xl border p-4 sm:p-5"
        >
          <h2 id="route-exam-day-title" className="text-on-surface text-base font-bold sm:text-lg">
            ¿Y el día del examen?
          </h2>
          <p className="text-on-surface-muted mt-2 text-sm leading-relaxed">
            Esta ruta explica cómo prepararte por competencias. Para gestionar tiempo, estrés y estrategia el día del
            Saber 11°, revisa la sección de consejos.
          </p>
          <Link
            href="/consejos"
            className={cn(
              'border-surface-border text-on-surface-muted mt-3 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5',
              'text-sm font-semibold transition-colors hover:border-violet-500/40 hover:text-violet-300',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            <Icon name="lightbulb" className="text-violet-400" />
            Ver consejos de estudio y examen
          </Link>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {recommendedHref ? (
            <Link
              href={recommendedHref}
              className={cn(
                'bg-app-accent inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
                'transition-colors hover:brightness-110 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              Continuar mi ruta
            </Link>
          ) : (
            <Link
              href={getJourneyStepHref(ROUTE_TO_500_STEPS[0], areaId) ?? '/ruta-aprendizaje'}
              className={cn(
                'bg-app-accent inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
                'transition-colors hover:brightness-110 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              Empezar en aprendizaje
            </Link>
          )}
          <Link
            href={getJourneyStepHref(ROUTE_TO_500_STEPS[3], areaId) ?? '/practica/lectura-critica'}
            className={cn(
              'inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
              'bg-linear-to-r from-amber-600 to-orange-600 transition-colors hover:brightness-110',
              'focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none'
            )}
          >
            Examen por materia
          </Link>
          <Link
            href={getJourneyStepHref(ROUTE_TO_500_STEPS[4], areaId) ?? '/examen-completo'}
            className={cn(
              'inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
              'bg-linear-to-r from-purple-600 to-indigo-600 transition-colors hover:brightness-110',
              'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none'
            )}
          >
            Examen global
          </Link>
        </div>
      </LecturaSectionShell>
    </div>
  );
}
