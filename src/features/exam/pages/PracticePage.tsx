'use client';

import { ExamConfigModal } from '@/features/exam/components';
import { PracticeResultsView } from '@/features/exam/components/practice/PracticeResultsView';
import { PracticeActiveView } from '@/features/exam/components/practice/PracticeActiveView';
import { usePracticeExam } from '@/features/exam/hooks/usePracticeExam';
import { LoadingState } from '@/shared/components/LoadingState';

export const PracticePage = () => {
  const {
    areaInfo,
    allQuestions,
    loadingQuestions,
    questionsError,
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
  } = usePracticeExam();

  if (loadingQuestions) {
    return <LoadingState label="Cargando preguntas…" layout="section" />;
  }

  if (questionsError) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-6 text-center text-sm text-red-200">
        {questionsError}
      </div>
    );
  }

  if (!examConfig) {
    return <ExamConfigModal area={areaInfo.name} totalQuestions={allQuestions.length} onStart={handleExamStart} />;
  }

  if (isFinished || showResults) {
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
      onAnswer={handleAnswer}
      onScrollToQuestion={handleScrollToQuestion}
      onFinish={() => setShowResults(true)}
    />
  );
};
