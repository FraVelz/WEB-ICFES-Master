'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import type { AreaId } from '@/shared/constants';
import { getAreaInfo } from '@/shared/constants';
import {
  getAreaSimulacroPhaseCopy,
  getJourneyStepHref,
  LECTURA_INDEX_PATH,
  type JourneyStep,
} from '@/features/learning/data/routeTo500';

const ACCENT_STYLES = {
  accent: {
    badge: 'bg-app-accent/20 text-app-accent',
    score: 'text-app-accent',
  },
  amber: {
    badge: 'bg-amber-500/20 text-amber-300',
    score: 'text-amber-300',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-300',
    score: 'text-purple-300',
  },
} as const;

type RouteTo500StepCardProps = {
  step: JourneyStep;
  areaId?: AreaId;
  showCta?: boolean;
  compact?: boolean;
};

export function RouteTo500StepCard({
  step,
  areaId = 'lectura-critica',
  showCta = true,
  compact = false,
}: RouteTo500StepCardProps) {
  const styles = ACCENT_STYLES[step.accent];
  const href = getJourneyStepHref(step, areaId);
  const areaSimulacroCopy = step.id === 'examen-materia' ? getAreaSimulacroPhaseCopy(areaId) : null;
  const title = areaSimulacroCopy?.title ?? step.title;
  const summary = areaSimulacroCopy?.summary ?? step.summary;

  return (
    <li
      className={cn(
        'border-surface-border/70 bg-surface-via/50 flex gap-3 rounded-xl border',
        compact ? 'px-3 py-2.5 sm:px-4 sm:py-3' : 'p-4 sm:p-5'
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
          styles.badge
        )}
        aria-hidden
      >
        {step.order}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-on-surface text-sm font-semibold">{title}</p>
          <span className={cn('text-xs font-bold tracking-wide', styles.score)}>{step.indicativeScoreLabel}</span>
        </div>
        {!compact && <p className="text-on-surface-muted text-xs font-medium">{step.subtitle}</p>}
        <p className={cn('text-on-surface-muted leading-relaxed', compact ? 'text-xs sm:text-sm' : 'text-sm')}>
          {summary}
        </p>
        {!compact && (
          <p className="text-on-surface-muted text-xs">
            <span className="text-on-surface font-semibold">Marco ICFES:</span> {step.performanceLevels}
          </p>
        )}
        {showCta && href ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href={href}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold text-white',
                step.accent === 'accent' && 'bg-app-accent hover:brightness-110',
                step.accent === 'amber' && 'bg-linear-to-r from-amber-600 to-orange-600 hover:brightness-110',
                step.accent === 'purple' && 'bg-linear-to-r from-purple-600 to-indigo-600 hover:brightness-110',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                step.accent === 'accent' && 'focus-visible:ring-app-accent',
                step.accent === 'amber' && 'focus-visible:ring-amber-400',
                step.accent === 'purple' && 'focus-visible:ring-purple-400',
                step.id === 'examen-global' && 'sm:flex-1'
              )}
            >
              {step.kind === 'learning'
                ? 'Ir a aprendizaje'
                : step.kind === 'practice-area'
                  ? `Simulacro de ${getAreaInfo(areaId).name}`
                  : 'Simulacro global'}
            </Link>
            {step.id === 'examen-global' ? (
              <Link
                href={LECTURA_INDEX_PATH}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-bold',
                  'border-purple-400/40 text-purple-200 hover:bg-purple-500/10',
                  'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none sm:flex-1'
                )}
              >
                Ver apartados de lectura
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}
