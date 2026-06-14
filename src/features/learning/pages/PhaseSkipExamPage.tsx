'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { FullExamActiveView } from '@/features/exam/components/fullExam/FullExamActiveView';
import { FullExamResultsView } from '@/features/exam/components/fullExam/FullExamResultsView';
import { ExamPageSkeleton, GradingSkeleton } from '@/shared/components/PageSkeletons';
import { EmptyState } from '@/shared/components/EmptyState';
import { getLearningPhasesHref } from '@/features/learning/data/competencyPhases';
import { usePhaseSkipExam } from '@/features/learning/phaseSkip/usePhaseSkipExam';

const errorBoxClass = 'mx-auto max-w-lg px-4';

export function PhaseSkipExamPage() {
  const {
    areaStr,
    areaInfo,
    phaseTitle,
    phaseSkipPassPercent,
    phaseSkipPassed,
    rewards,
    exitHref,
    loadingQuestions,
    questionsError,
    gradingError,
    examConfig,
    questions,
    answers,
    showResults,
    setShowResults,
    timeRemaining,
    isFinished,
    handleAnswer,
    handleScrollToQuestion,
    resetExam,
    results,
    correctCount,
    percentage,
    timeColor,
  } = usePhaseSkipExam();

  const phasesHref = getLearningPhasesHref(areaStr || undefined);

  if (loadingQuestions) {
    return <ExamPageSkeleton questionCount={5} />;
  }

  if (questionsError) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="No se pudo iniciar el simulacro"
        description={questionsError}
        actionLabel="Volver a fases"
        actionHref={phasesHref}
        className={errorBoxClass}
      />
    );
  }

  if (!examConfig || questions.length === 0) {
    return <ExamPageSkeleton questionCount={5} />;
  }

  if (isFinished || showResults) {
    if (gradingError) {
      return (
        <EmptyState
          icon="exclamation-circle"
          title="Error al calificar"
          description={gradingError}
          actionLabel="Reintentar"
          onAction={resetExam}
          className={errorBoxClass}
        />
      );
    }

    if (results.length === 0) {
      return <GradingSkeleton />;
    }

    return (
      <>
        {phaseSkipPassed && (
          <div className="relative z-20 mx-auto max-w-3xl px-6 pt-6">
            <div
              className={cn(
                'rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-4',
                'text-center text-green-900 dark:text-green-100'
              )}
            >
              <p className="font-semibold">¡Fase completada con simulacro!</p>
              <p className="mt-1 text-sm text-green-800/90 dark:text-green-200/90">
                Todas las lecciones de {phaseTitle ?? 'esta fase'} quedaron marcadas como completadas.
              </p>
              {rewards && (rewards.xp > 0 || rewards.coins > 0) ? (
                <p className="mt-2 text-sm font-semibold text-amber-300">
                  +{rewards.xp} XP · +{rewards.coins} monedas
                </p>
              ) : null}
              <Link
                href={phasesHref}
                className={cn(
                  'mt-3 inline-flex rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white',
                  'hover:bg-green-500'
                )}
              >
                Volver a fases
              </Link>
            </div>
          </div>
        )}
        <FullExamResultsView
          areaInfo={areaInfo}
          examConfig={examConfig}
          questions={questions}
          answers={answers}
          results={results}
          correctCount={correctCount}
          percentage={percentage}
          onScrollToQuestion={handleScrollToQuestion}
          onRetry={resetExam}
          exitHref={exitHref}
        />
      </>
    );
  }

  return (
    <FullExamActiveView
      areaInfo={areaInfo}
      examConfig={examConfig}
      questions={questions}
      answers={answers}
      timeRemaining={timeRemaining}
      timeColor={timeColor}
      headerSubtitle={phaseTitle ? `Simulacro de fase · ${phaseTitle}` : `Preguntas: ${questions.length}`}
      phaseSkipPhaseTitle={phaseTitle}
      phaseSkipPassPercent={phaseSkipPassPercent}
      exitHref={exitHref}
      onAnswer={handleAnswer}
      onScrollToQuestion={handleScrollToQuestion}
      onFinish={() => setShowResults(true)}
    />
  );
}
