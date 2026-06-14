'use client';

import { FullExamActiveView } from '@/features/exam/components/fullExam/FullExamActiveView';
import { FullExamResultsView } from '@/features/exam/components/fullExam/FullExamResultsView';
import { useFullExam } from '@/features/exam/hooks/useFullExam';
import { ExamPageSkeleton, GradingSkeleton } from '@/shared/components/PageSkeletons';
import { EmptyState } from '@/shared/components/EmptyState';

export const FullExamPage = () => {
  const {
    areaInfo,
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

  if (loadingQuestions || !examConfig) {
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
