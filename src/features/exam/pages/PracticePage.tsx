'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import { ExamConfigModal } from '@/features/exam/components';
import { PracticeResultsView } from '@/features/exam/components/practice/PracticeResultsView';
import { PracticeActiveView } from '@/features/exam/components/practice/PracticeActiveView';
import { usePracticeExam } from '@/features/exam/hooks/usePracticeExam';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';
import { getLearningPhasesHref, isPhasesAreaSlug } from '@/features/learning/data/competencyPhases';
import { RouteTo500ContextBanner } from '@/features/learning/components/routeTo500/RouteTo500ContextBanner';
import { BreadcrumbNav } from '@/shared/components/BreadcrumbNav';
import { PhaseSkipNotice } from '@/features/exam/components/practice/PhaseSkipNotice';

const errorBoxClass = 'mx-auto max-w-lg px-4';

function PracticeErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="exclamation-circle"
      title="Error en la práctica"
      description={message}
      actionLabel={onRetry ? 'Reintentar' : undefined}
      onAction={onRetry}
      className={errorBoxClass}
    />
  );
}

export const PracticePage = () => {
  const { area: areaParam } = useParams<{ area: string }>();
  const areaSlug = Array.isArray(areaParam) ? areaParam[0] : (areaParam ?? '');
  const phasesHref = getLearningPhasesHref(isPhasesAreaSlug(areaSlug) ? areaSlug : undefined);

  const {
    areaInfo,
    isPhaseSkipMode,
    phaseSkipPhaseTitle,
    phaseSkipPassed,
    phaseSkipPassPercent,
    allQuestions,
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
    mobileMenuOpen,
    setMobileMenuOpen,
    showAnswerSheetMobile,
    setShowAnswerSheetMobile,
    handleExamStart,
    handleAnswer,
    handleScrollToQuestion,
    resetExam,
    results,
    correctCount,
    percentage,
    timeColor,
    exitHref,
  } = usePracticeExam();

  if (loadingQuestions) {
    return <LoadingState label="Cargando preguntas…" layout="section" />;
  }

  if (questionsError) {
    return <PracticeErrorState message={questionsError} onRetry={() => window.location.reload()} />;
  }

  const phaseSkipBanner = isPhaseSkipMode ? (
    <PhaseSkipNotice
      phaseTitle={phaseSkipPhaseTitle}
      passPercent={phaseSkipPassPercent}
      className="mx-auto mb-6 max-w-lg"
    />
  ) : null;

  const routeBanner = !isPhaseSkipMode ? (
    <RouteTo500ContextBanner stepId="examen-materia" areaName={areaInfo.name} className="max-w-lg" />
  ) : null;

  if (!examConfig) {
    if (isPhaseSkipMode) {
      if (allQuestions.length === 0) {
        return (
          <div className="px-4 pt-6">
            <BreadcrumbNav
              className="mb-4"
              items={[{ label: 'Aprendizaje', href: '/ruta-aprendizaje/' }, { label: `Práctica ${areaInfo.name}` }]}
            />
            {phaseSkipBanner}
            <EmptyState
              icon="exclamation-circle"
              title="Sin preguntas disponibles"
              description="No hay preguntas cargadas para este simulacro. Intenta más tarde."
              className={errorBoxClass}
            />
          </div>
        );
      }

      return (
        <div className="px-4 pt-6">
          <BreadcrumbNav
            className="mb-4"
            items={[{ label: 'Aprendizaje', href: '/ruta-aprendizaje/' }, { label: `Práctica ${areaInfo.name}` }]}
          />
          {phaseSkipBanner}
          <LoadingState label="Preparando simulacro…" layout="section" />
        </div>
      );
    }

    return (
      <div className="px-4 pt-6">
        <BreadcrumbNav
          className="mb-4"
          items={[{ label: 'Aprendizaje', href: '/ruta-aprendizaje/' }, { label: `Práctica ${areaInfo.name}` }]}
        />
        {routeBanner}
        <ExamConfigModal area={areaInfo.name} totalQuestions={allQuestions.length} onStart={handleExamStart} />
      </div>
    );
  }

  if (isFinished || showResults) {
    if (gradingError) {
      return <PracticeErrorState message={gradingError} onRetry={resetExam} />;
    }

    if (results.length === 0) {
      return <LoadingState label="Calificando examen…" layout="section" />;
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
              <p className="font-semibold">¡Fase superada!</p>
              <p className="mt-1 text-sm text-green-800/90 dark:text-green-200/90">
                Superaste la fase en {areaInfo.name}.
              </p>
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
        <PracticeResultsView
          areaInfo={areaInfo}
          examConfig={examConfig}
          questions={questions}
          answers={answers}
          results={results}
          correctCount={correctCount}
          percentage={percentage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onScrollToQuestion={handleScrollToQuestion}
          onRetry={resetExam}
          exitHref={exitHref}
        />
      </>
    );
  }

  return (
    <PracticeActiveView
      areaInfo={areaInfo}
      examConfig={examConfig}
      questions={questions}
      answers={answers}
      showResults={showResults}
      timeRemaining={timeRemaining}
      timeColor={timeColor}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      showAnswerSheetMobile={showAnswerSheetMobile}
      setShowAnswerSheetMobile={setShowAnswerSheetMobile}
      phaseSkipPhaseTitle={isPhaseSkipMode ? phaseSkipPhaseTitle : undefined}
      phaseSkipPassPercent={isPhaseSkipMode ? phaseSkipPassPercent : undefined}
      exitHref={exitHref}
      onAnswer={handleAnswer}
      onScrollToQuestion={handleScrollToQuestion}
      onFinish={() => setShowResults(true)}
    />
  );
};
