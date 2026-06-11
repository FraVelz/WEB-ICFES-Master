'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { CompetencyPhase } from '@/features/learning/data/competencyPhases';
import { getRoadmapHref } from '@/features/learning/data/competencyPhases';
import type { PhaseCardStatus } from '@/features/learning/data/phaseProgressUtils';

type PhaseStageCardProps = {
  phase: CompetencyPhase;
  status: PhaseCardStatus;
  progressPercent: number;
  lessonCount: number;
  areaFocus?: string;
  sectionId: string;
  skipExamHref?: string;
  skippedByExam?: boolean;
};

export function PhaseStageCard({
  phase,
  status,
  progressPercent,
  lessonCount,
  areaFocus,
  sectionId,
  skipExamHref,
  skippedByExam = false,
}: PhaseStageCardProps) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const roadmapHref = getRoadmapHref(sectionId);

  return (
    <article
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-4',
        isLocked && 'opacity-60',
        isActive && 'border-app-accent/40 ring-1 ring-app-accent/20'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-on-surface-muted text-xs font-bold tracking-wide uppercase">Etapa {phase.order}</p>
          <h2 className="text-on-surface text-lg font-bold">{phase.title}</h2>
          <p className="text-on-surface-muted text-sm">{phase.subtitle}</p>
        </div>
        {isCompleted && <Icon name="check-circle" className="shrink-0 text-green-500" />}
      </div>

      <div className="bg-surface-via mt-3 h-2 overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isCompleted ? 'bg-green-500' : 'bg-app-accent'
          )}
          style={{ width: `${isLocked ? 0 : progressPercent}%` }}
        />
      </div>
      <p className="text-on-surface-muted mt-1 text-xs">
        {skippedByExam
          ? 'Fase superada con examen'
          : `${lessonCount} lecciones · ${isLocked ? '0' : progressPercent}%`}
      </p>

      {isActive && areaFocus && (
        <p className="text-on-surface-muted mt-3 text-sm leading-relaxed">{areaFocus}</p>
      )}

      {!isLocked && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={roadmapHref}
            className={cn(
              'bg-app-accent inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white',
              'transition-colors hover:brightness-110',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            {isCompleted ? 'Repasar' : 'Continuar'}
          </Link>
          {isActive && !isCompleted && skipExamHref && (
            <Link
              href={skipExamHref}
              className={cn(
                'border-surface-border text-on-surface-muted inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold',
                'transition-colors hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-200',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              <Icon name="bolt" className="text-amber-400" />
              Saltar fase con examen
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
