'use client';

import { useRouter } from 'next/navigation';
import { ExamConfigModal } from '@/features/exam/components';
import { FullExamActiveView } from '@/features/exam/components/fullExam/FullExamActiveView';
import { FullExamResultsView } from '@/features/exam/components/fullExam/FullExamResultsView';
import { useFullExam } from '@/features/exam/hooks/useFullExam';
import { ExamPageSkeleton, GradingSkeleton } from '@/shared/components/PageSkeletons';
import { EmptyState } from '@/shared/components/EmptyState';
import { RouteTo500ContextBanner } from '@/features/learning/components/routeTo500/RouteTo500ContextBanner';

export const FullExamPage = () => {
  const router = useRouter();
  const {
    areaInfo,
    allQuestions,
    loadingQuestions,
    questionsError,
    gradingError,
    reloadQuestions,
    retryGrading,
    examConfig,
    questions,
    answers,
    showResults,
    setShowResults,
    isFinished,
    gradedResults,
    handleExamStart,
    handleAnswer,
    handleScrollToQuestion,
    resetExam,
    results,
    correctCount,
    percentage,
    timeRemaining,
    timeColor,
    exitHref,
  } = useFullExam();

  if (loadingQuestions) {
    return <ExamPageSkeleton questionCount={6} />;
  }

  if (questionsError) {
    return (
      <EmptyState
        icon="exclamation-triangle"
        title="No se pudieron cargar las preguntas"
        description={questionsError}
        actionLabel="Reintentar"
        onAction={() => void reloadQuestions()}
        className="mx-auto max-w-lg"
      />
    );
  }

  if (!examConfig) {
    return (
      <div className="px-4 pt-6">
        <RouteTo500ContextBanner stepId="examen-global" />
        <ExamConfigModal
          area={areaInfo.name}
          totalQuestions={allQuestions.length}
          onStart={handleExamStart}
          onCancel={() => router.push(exitHref)}
          isFullExam={true}
        />
      </div>
    );
  }

  if (isFinished || showResults) {
    if (gradingError) {
      return (
        <EmptyState
          icon="exclamation-triangle"
          title="Error al calificar el examen"
          description={gradingError}
          actionLabel="Reintentar"
          onAction={retryGrading}
          className="mx-auto max-w-lg"
        />
      );
    }

    if (!gradedResults) {
      return <GradingSkeleton />;
    }

    return (
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
      onAnswer={handleAnswer}
      onScrollToQuestion={handleScrollToQuestion}
      onFinish={() => setShowResults(true)}
      exitHref={exitHref}
    />
  );
};
