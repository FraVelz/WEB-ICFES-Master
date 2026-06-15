'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AREA_INFO } from '@/shared/constants';
import { ExamConfigForm } from '@/features/exam/components/ExamConfigForm';
import { ExamPageSkeleton } from '@/shared/components/PageSkeletons';
import { EmptyState } from '@/shared/components/EmptyState';
import { RouteTo500ContextBanner } from '@/features/learning/components/routeTo500/RouteTo500ContextBanner';
import { getLearningPhasesHref } from '@/features/learning/data/competencyPhases';
import { fetchQuestionsForFullExam } from '@/features/exam/services/QuestionService';
import { capFullExamQuestionCount } from '@/features/exam/constants/fullExamLimits';
import { savePendingFullExamConfig } from '@/features/exam/utils/fullExamConfigStorage';
import {
  getSimulacroCompletoExamHref,
  SIMULACRO_COMPLETO_SECTION_PATH,
} from '@/features/exam/utils/simulacroNavigation';
import type { ExamConfig } from '@/features/exam/types';
import { useCallback, useEffect, useState } from 'react';

export function SimulacroCompletoSectionPage() {
  const router = useRouter();
  const areaInfo = AREA_INFO['examen-completo'];
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loaded = await fetchQuestionsForFullExam();
      setTotalQuestions(capFullExamQuestionCount(loaded.length));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las preguntas.');
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const handleStart = (config: ExamConfig) => {
    savePendingFullExamConfig(config);
    router.push(getSimulacroCompletoExamHref(SIMULACRO_COMPLETO_SECTION_PATH));
  };

  if (loading) {
    return <ExamPageSkeleton questionCount={4} />;
  }

  if (error || totalQuestions === 0) {
    return (
      <EmptyState
        icon="exclamation-triangle"
        title="No se pudieron cargar las preguntas"
        description={error ?? 'No hay preguntas disponibles para el simulacro.'}
        actionLabel="Reintentar"
        onAction={() => void loadQuestions()}
        className="mx-auto max-w-lg"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-8 sm:px-0">
      <header className="space-y-3">
        <Link
          href={getLearningPhasesHref()}
          className={cn(
            'text-app-accent inline-flex items-center gap-1 text-sm font-semibold underline-offset-2 hover:underline',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <Icon name="arrow-left" className="text-xs" />
          Volver a fases por materia
        </Link>
        <div className="space-y-2">
          <p className="text-on-surface-muted text-xs font-bold tracking-wide uppercase">Simulacro integral</p>
          <h1 className="text-on-surface text-2xl font-bold sm:text-3xl">{areaInfo.name}</h1>
          <p className="text-on-surface-muted text-sm leading-relaxed">
            Todas las áreas del ICFES Saber 11.° en un solo examen. Ajusta la duración y el número de preguntas antes de
            comenzar.
          </p>
        </div>
      </header>

      <RouteTo500ContextBanner stepId="examen-global" />

      <section
        className={cn(
          'border-surface-border bg-surface-elevated/80 rounded-2xl border p-6 shadow-sm sm:p-8',
          'from-subject-full-from/5 bg-linear-to-br to-transparent'
        )}
      >
        <ExamConfigForm
          area={areaInfo.name}
          totalQuestions={totalQuestions}
          onStart={handleStart}
          isFullExam
          variant="page"
        />
      </section>
    </div>
  );
}
