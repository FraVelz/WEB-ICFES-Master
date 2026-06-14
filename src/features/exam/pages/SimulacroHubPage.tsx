'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AREA_INFO, HOME_AREA_IDS } from '@/shared/constants/areaInfo';
import {
  getSimulacroAreaHref,
  getSimulacroCompletoHref,
  getSimulacroHubHref,
} from '@/features/exam/utils/simulacroNavigation';
import { getLearningPhasesHref } from '@/features/learning/data/competencyPhases';

const AREA_ICONS: Record<string, string> = {
  'lectura-critica': 'book-open',
  matematicas: 'calculator',
  'ciencias-naturales': 'flask',
  'sociales-ciudadanas': 'landmark',
  ingles: 'language',
};

export function SimulacroHubPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <Link
          href={getLearningPhasesHref()}
          className="text-app-accent inline-flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          <Icon name="arrow-left" className="text-xs" />
          Volver a fases
        </Link>
        <h1 className="text-on-surface text-2xl font-bold">Simulacros</h1>
        <p className="text-on-surface-muted text-sm">
          Practica por materia o enfrenta el simulacro completo en pantalla dedicada.
        </p>
      </header>

      <Link
        href={getSimulacroCompletoHref()}
        className={cn(
          'border-surface-border bg-surface-elevated/80 flex items-start justify-between gap-4 rounded-2xl border p-5',
          'transition-colors hover:border-red-500/40 hover:bg-red-500/5',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
        )}
      >
        <div className="space-y-1">
          <p className="text-on-surface-muted text-xs font-bold tracking-wide uppercase">Simulacro completo</p>
          <p className="text-on-surface text-lg font-semibold">{AREA_INFO['examen-completo'].name}</p>
          <p className="text-on-surface-muted text-sm">Todas las áreas · condiciones tipo ICFES</p>
        </div>
        <Icon name="clipboard-list" className="mt-1 shrink-0 text-red-400" />
      </Link>

      <ul className="grid gap-3 sm:grid-cols-2">
        {HOME_AREA_IDS.filter((id) => id !== 'examen-completo').map((areaId) => {
          const area = AREA_INFO[areaId];
          const href = getSimulacroAreaHref(areaId);
          if (!href) return null;

          return (
            <li key={areaId}>
              <Link
                href={href}
                className={cn(
                  'border-surface-border bg-surface-elevated/80 block rounded-2xl border p-4',
                  'transition-colors hover:border-app-accent/40 hover:bg-app-accent/5',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon name={AREA_ICONS[areaId] ?? 'book'} className="text-app-accent text-xl" />
                  <div>
                    <p className="text-on-surface font-semibold">{area.name}</p>
                    <p className="text-on-surface-muted text-xs">Simulacro por materia</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-on-surface-muted text-center text-xs">
        Los simulacros de fase se abren desde{' '}
        <Link href={getLearningPhasesHref()} className="text-app-accent font-semibold hover:underline">
          Fases de aprendizaje
        </Link>
        .
      </p>
    </div>
  );
}
