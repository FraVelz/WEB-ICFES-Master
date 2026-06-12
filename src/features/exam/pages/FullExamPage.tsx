'use client';

import { ExamConfigModal } from '@/features/exam/components';
import { FullExamActiveView } from '@/features/exam/components/fullExam/FullExamActiveView';
import { FullExamResultsView } from '@/features/exam/components/fullExam/FullExamResultsView';
import { useFullExam } from '@/features/exam/hooks/useFullExam';
import { LoadingState } from '@/shared/components/LoadingState';
import { RouteTo500ContextBanner } from '@/features/learning/components/routeTo500/RouteTo500ContextBanner';

export const FullExamPage = () => {
  const {
    areaInfo,
    allQuestions,
    loadingQuestions,
    questionsError,
    gradingError,
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
  } = useFullExam();

  if (loadingQuestions) {
    return <LoadingState label="Cargando preguntas…" layout="section" />;
  }

  if (questionsError) {
    return (
      <div
        className={
          'mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-6 ' +
          'text-center text-sm text-red-200'
        }
      >
        {questionsError}
      </div>
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
          isFullExam={true}
        />
      </div>
    );
  }

  if (isFinished || showResults) {
    if (gradingError) {
      return (
        <div
          className={
            'mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-6 ' +
            'text-center text-sm text-red-200'
          }
        >
          {gradingError}
        </div>
      );
    }

    if (!gradedResults) {
      return <LoadingState label="Calificando examen…" layout="section" />;
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
    />
  );
};
