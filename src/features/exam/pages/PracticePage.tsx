'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { ExamConfigModal } from '@/features/exam/components';
import { PracticeResultsView } from '@/features/exam/components/practice/PracticeResultsView';
import { PracticeActiveView } from '@/features/exam/components/practice/PracticeActiveView';
import { usePracticeExam } from '@/features/exam/hooks/usePracticeExam';
import { LoadingState } from '@/shared/components/LoadingState';
import { LEARNING_PHASES_PATH } from '@/features/learning/data/competencyPhases';

const errorBoxClass =
  'mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-6 text-center text-sm text-red-200';

export const PracticePage = () => {
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
  } = usePracticeExam();

  if (loadingQuestions) {
    return <LoadingState label="Cargando preguntas…" layout="section" />;
  }

  if (questionsError) {
    return (
      <div className={errorBoxClass}>{questionsError}</div>
    );
  }

  const phaseSkipBanner = isPhaseSkipMode ? (
    <div
      className={cn(
        'mx-auto mb-6 max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100'
      )}
    >
      Examen para saltar{' '}
      <span className="font-semibold">{phaseSkipPhaseTitle ?? 'esta fase'}</span>. Necesitas al menos{' '}
      <span className="font-semibold">{phaseSkipPassPercent}%</span> de aciertos para superar esta fase.
    </div>
  ) : null;

  if (!examConfig) {
    return (
      <div className="px-4 pt-6">
        {phaseSkipBanner}
        <ExamConfigModal area={areaInfo.name} totalQuestions={allQuestions.length} onStart={handleExamStart} />
      </div>
    );
  }

  if (isFinished || showResults) {
    if (gradingError) {
      return (
        <div className={errorBoxClass}>{gradingError}</div>
      );
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
                'text-center text-green-100'
              )}
            >
              <p className="font-semibold">¡Fase superada!</p>
              <p className="mt-1 text-sm text-green-200/90">Superaste la fase en {areaInfo.name}.</p>
              <Link
                href={LEARNING_PHASES_PATH}
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
        />
      </>
    );
  }

  return (
    <>
      {phaseSkipBanner && <div className="relative z-20 px-6 pt-4">{phaseSkipBanner}</div>}
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
    </>
  );
};
