'use client';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExamConfigModal } from '@/features/exam/components';
import { AnswerSheet } from '@/features/exam/components';
import { ResultsAnalysis } from '@/features/exam/components';
import { formatTimeExtended } from '@/shared/utils/timeFormatter';
import { saveFullExam } from '@/shared/utils/progressStorage';
import { MATHEMATICS_QUESTIONS, LANGUAGE_QUESTIONS, SCIENCE_QUESTIONS, SOCIAL_QUESTIONS } from '@/shared/data';
import type { ExamQuestion } from '@/shared/types/question';
import type { ExamConfig } from '@/features/exam/types';

const AREA_INFO = {
  'examen-completo': {
    name: 'Examen Completo ICFES',
    color: 'from-pink-400 to-pink-600',
  },
};

export const FullExamPage = () => {
  const allQuestions: ExamQuestion[] = [
    ...MATHEMATICS_QUESTIONS,
    ...LANGUAGE_QUESTIONS,
    ...SCIENCE_QUESTIONS,
    ...SOCIAL_QUESTIONS,
  ];

  const areaInfo = AREA_INFO['examen-completo'];

  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleExamStart = (config: ExamConfig) => {
    const selectedQuestions = allQuestions.slice(0, config.numQuestions);
    setQuestions(selectedQuestions);
    setExamConfig(config);

    if (config.useTimer) {
      setTimeRemaining(config.numQuestions * (config.timePerQuestion ?? 2) * 60);
    }
  };

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleScrollToQuestion = (index: number) => {
    const questionElement = document.getElementById(`question-${index}`);
    questionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Persist full exam on finish
  useEffect(() => {
    if (isFinished || showResults) {
      if (questions.length > 0) {
        const results = questions.map((q) => ({
          question: q,
          correct: answers[q.id] === q.correctAnswer,
          userAnswer: answers[q.id],
        }));

        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / questions.length) * 100);

        saveFullExam({
          examType: 'full-exam',
          questions,
          answers,
          correctCount,
          percentage,
          totalQuestions: questions.length,
          config: examConfig,
          completedAt: new Date().toISOString(),
        });
      }
    }
  }, [isFinished, showResults, questions, answers, examConfig]);

  if (!examConfig) {
    return (
      <ExamConfigModal
        area={areaInfo.name}
        totalQuestions={allQuestions.length}
        onStart={handleExamStart}
        isFullExam={true}
      />
    );
  }

  if (isFinished || showResults) {
    const results = questions.map((q) => ({
      question: q,
      correct: answers[q.id] === q.correctAnswer,
      userAnswer: answers[q.id],
    }));

    const correctCount = results.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div
            className={cn(
              'sticky top-0 z-40 border-b border-white/10 bg-linear-to-b from-gray-900 via-gray-900',
              'to-transparent py-4 backdrop-blur-md'
            )}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
              <div>
                <div
                  className={cn(
                    'mb-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold text-white',
                    `bg-linear-to-r ${areaInfo.color}`
                  )}
                >
                  {areaInfo.name}
                </div>
                <p className="text-sm text-gray-400">Análisis de Resultados</p>
              </div>

              <Link
                href="/"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-white/20"
              >
                Salir
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Results Column */}
              <div className="lg:col-span-3">
                <ResultsAnalysis
                  results={results}
                  questions={questions}
                  percentage={percentage}
                  correctCount={correctCount}
                  areaInfo={areaInfo}
                  examConfig={examConfig}
                  onRetry={() => {
                    setExamConfig(null);
                    setAnswers({});
                    setShowResults(false);
                    setIsFinished(false);
                  }}
                />
              </div>

              {/* Answer Sheet Sidebar */}
              <div>
                <AnswerSheet
                  totalQuestions={questions.length}
                  answers={answers}
                  currentQuestion={0}
                  onQuestionClick={handleScrollToQuestion}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeColor =
    timeRemaining !== null && timeRemaining < 300
      ? 'text-red-400'
      : timeRemaining !== null && timeRemaining < 600
        ? 'text-yellow-400'
        : 'text-cyan-300';

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div
          className={cn(
            'sticky top-0 z-40 border-b border-white/10 bg-linear-to-b from-gray-900 via-gray-900',
            'to-transparent py-4 backdrop-blur-md'
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div>
              <div
                className={cn(
                  'mb-2 inline-block rounded-lg px-3 py-1 text-xs font-semibold text-white',
                  `bg-linear-to-r ${areaInfo.color}`
                )}
              >
                {areaInfo.name}
              </div>
              <p className="text-sm text-gray-400">Preguntas: {questions.length}</p>
            </div>

            {examConfig.useTimer && timeRemaining !== null && (
              <div className={cn('font-mono text-2xl font-bold', timeColor)}>{formatTimeExtended(timeRemaining)}</div>
            )}

            <Link
              href="/"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-white/20"
            >
              Salir
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Questions Column */}
            <div className="space-y-6 lg:col-span-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  id={`question-${index}`}
                  className={cn(
                    'rounded-xl border border-white/10 bg-linear-to-br from-gray-800/40 via-gray-900/40',
                    'to-gray-950/40 p-6 shadow-lg backdrop-blur-md transition-all duration-300',
                    'hover:border-white/20 hover:shadow-xl'
                  )}
                >
                  {/* Question Number and Title */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r',
                          'from-cyan-500 to-blue-500 text-sm font-bold'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg leading-relaxed font-semibold text-white">{question.text}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Dificultad: <span className="text-cyan-300">{question.difficulty}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="ml-14 space-y-3">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.letter;

                      return (
                        <button
                          key={option.letter}
                          onClick={() => handleAnswer(question.id, option.letter ?? option.id ?? String(option.text))}
                          className={cn(
                            'w-full rounded-lg border-2 p-4 text-left transition-all duration-300',
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                              : 'border-white/20 bg-white/5 text-white hover:border-cyan-400/50 hover:bg-cyan-500/10'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
                                isSelected ? 'border-cyan-400 bg-cyan-500 text-white' : 'border-white/30'
                              )}
                            >
                              {option.letter}
                            </div>
                            <span>{option.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation - Only shown after exam finishes */}
                  {showResults && examConfig?.showExplanations && answers[question.id] && (
                    <div className="mt-6 ml-14 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                      <p className="mb-2 text-xs font-semibold text-blue-300">EXPLICACIÓN:</p>
                      <p className="text-sm text-gray-200">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Final Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setShowResults(true)}
                  className={cn(
                    'rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-12 py-4 text-lg font-bold',
                    'text-white transition-all duration-300 hover:from-green-600 hover:to-emerald-600',
                    'hover:shadow-lg hover:shadow-green-500/50'
                  )}
                >
                  Finalizar Examen
                </button>
              </div>
            </div>

            {/* Answer Sheet Sidebar */}
            <div>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={handleScrollToQuestion}
                questions={questions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
