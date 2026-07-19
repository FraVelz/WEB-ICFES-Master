'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { getSimulacroAreaHref, getSimulacroCompletoHref } from '@/features/exam/utils/simulacroNavigation';
import { formatPublishedCoverageLabel, isAreaCoverageEmpty } from '@/features/exam/utils/areaCoverage';
import { AREAS } from '@/features/home/data';

export const AreasSection = () => {
  const [coverage, setCoverage] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch('/api/exam/coverage')
      .then(async (response) => {
        if (!response.ok) throw new Error('coverage request failed');
        return (await response.json()) as { coverage?: Record<string, number> };
      })
      .then((data) => {
        if (!cancelled) setCoverage(data.coverage ?? {});
      })
      .catch(() => {
        if (!cancelled) setCoverage({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Domina Cada Área</h2>

        <p className="text-on-surface-muted mx-auto max-w-2xl text-lg">
          Contenido especializado, preguntas ICFES de simulacro y cursos para temas básicos, para las 5 áreas
          principales del ICFES
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => {
          const publishedCount = coverage?.[area.id] ?? 0;
          const loadingCoverage = coverage === null;
          const empty = !loadingCoverage && isAreaCoverageEmpty(publishedCount);
          const coverageLabel = loadingCoverage ? 'Cargando cobertura…' : formatPublishedCoverageLabel(publishedCount);

          const body = (
            <>
              <div className="absolute top-6 right-6 text-5xl opacity-20">
                <Icon name={area.icon} size="xl" className="text-white" />
              </div>

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-4xl">
                    <Icon name={area.icon} size="xl" className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{area.name}</h3>
                </div>

                <p className="mb-6 text-white/80">{area.description}</p>

                <div className={cn('flex flex-wrap gap-3', empty ? 'mb-2' : 'mb-6')}>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">{coverageLabel}</span>
                  {area.dificultad ? (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">{area.dificultad}</span>
                  ) : null}
                </div>

                {empty ? (
                  <p className="text-sm text-white/70">Aún no hay preguntas publicadas en el banco para esta área.</p>
                ) : loadingCoverage ? null : (
                  <div
                    className={cn(
                      'flex items-center gap-2 font-bold text-white transition-all duration-300',
                      'group-hover:gap-4'
                    )}
                  >
                    Empezar
                    <Icon name="arrow-right" className="shrink-0 transition-transform group-hover:translate-x-2" />
                  </div>
                )}
              </div>
            </>
          );

          if (loadingCoverage || empty) {
            return (
              <div key={area.id}>
                <div
                  className={cn(
                    'relative h-full rounded-xl border p-8',
                    empty ? 'border-dashed border-white/30 opacity-90' : 'border-surface-border',
                    `bg-linear-to-br ${area.gradient}`
                  )}
                  aria-label={`${area.name}: ${coverageLabel}`}
                  aria-busy={loadingCoverage || undefined}
                >
                  {body}
                </div>
              </div>
            );
          }

          return (
            <div key={area.id}>
              <Link
                href={getSimulacroAreaHref(area.id) ?? '/simulacro'}
                className={cn(
                  'group relative block rounded-xl',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
                )}
              >
                <div
                  className={cn(
                    'border-surface-border h-full cursor-pointer rounded-xl border p-8 transition-all duration-300',
                    'hover:border-on-surface-muted hover:shadow-surface-elevated/50 hover:scale-105 hover:shadow-lg',
                    `bg-linear-to-br ${area.gradient}`
                  )}
                >
                  {body}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <div
          className={cn(
            'rounded-xl border-2 border-red-500/50 bg-linear-to-r from-red-600/20 to-pink-600/20',
            'p-8 text-center'
          )}
        >
          <h3 className="mb-4 flex items-center justify-center gap-2 text-3xl font-bold text-white">
            <Icon name="fire" className="shrink-0 text-red-400" />
            ¿Listo para el Desafío Real?
          </h3>

          <p className="text-on-surface-muted mx-auto mb-6 max-w-2xl">
            Realiza un simulacro completo bajo condiciones reales: tiempo limitado y puntuación según el banco
            publicado.
          </p>

          <Link
            href={getSimulacroCompletoHref()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-pink-600 px-8',
              'py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg',
              'hover:shadow-red-500/50',
              'focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
            )}
          >
            <Icon name="bullseye" />
            Hacer Simulacro Completo
          </Link>
        </div>
      </div>
    </section>
  );
};
