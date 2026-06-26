'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { snoozeLevelAssessment } from '@/features/auth/utils/levelAssessmentSnooze';
import type { LevelAssessmentContext } from '@/features/auth/types/skillLevel';

type LevelAssessmentBannerProps = {
  context: LevelAssessmentContext;
  scope: string;
  onDismiss: () => void;
};

export function LevelAssessmentBanner({ context, scope, onDismiss }: LevelAssessmentBannerProps) {
  const handleDefer = () => {
    snoozeLevelAssessment(scope);
    onDismiss();
  };

  return (
    <div
      role="region"
      aria-label="Evaluación de nivel inicial"
      className={cn(
        'border-app-ring/40 bg-app-ring/10 text-on-surface border-b px-4 py-3',
        'pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6'
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Icon name="chart-line" className="text-app-accent mt-0.5 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Personaliza tu ruta de estudio</p>
            <p className="text-on-surface-muted text-sm leading-relaxed">
              Responde unas preguntas rápidas para recomendarte por dónde empezar según tu nivel.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={handleDefer}
            className={cn(
              'border-surface-border text-on-surface-muted hover:text-on-surface rounded-lg border px-3 py-2',
              'text-sm font-medium transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            Más tarde
          </button>
          <Link
            href={buildLevelAssessmentUrl(context)}
            className={cn(
              'bg-app-accent-strong text-app-on-accent inline-flex items-center gap-2 rounded-lg px-4 py-2',
              'text-sm font-semibold transition-opacity hover:opacity-90',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            <Icon name="rocket" aria-hidden />
            Empezar evaluación
          </Link>
        </div>
      </div>
    </div>
  );
}
