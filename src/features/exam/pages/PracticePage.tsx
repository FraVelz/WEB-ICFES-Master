'use client';

import { cn } from '@/utils/cn';
import { ExamConfigModal } from '@/features/exam/components';
import { PracticeResultsView } from '@/features/exam/components/practice/PracticeResultsView';
import { PracticeActiveView } from '@/features/exam/components/practice/PracticeActiveView';
import { usePracticeExam } from '@/features/exam/hooks/usePracticeExam';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';
import { RouteTo500ContextBanner } from '@/features/learning/components/routeTo500/RouteTo500ContextBanner';
import { BreadcrumbNav } from '@/shared/components/BreadcrumbNav';

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

  if (!examConfig) {
    return (
      <div className="px-4 pt-6">
        <BreadcrumbNav
          className="mb-4"
          items={[{ label: 'Aprendizaje', href: '/ruta-aprendizaje/' }, { label: `Práctica ${areaInfo.name}` }]}
        />
        <RouteTo500ContextBanner stepId="examen-materia" areaName={areaInfo.name} className="max-w-lg" />
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
      exitHref={exitHref}
      onAnswer={handleAnswer}
      onScrollToQuestion={handleScrollToQuestion}
      onFinish={() => setShowResults(true)}
    />
  );
};
