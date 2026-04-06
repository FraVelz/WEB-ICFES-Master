'use client';

import { cn } from '@/utils/cn';
import React, { useState, useEffect } from 'react';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { gamificationPersistence } from '@/services/persistence';
import { getCompletedLessons, markLessonAsCompleted } from '@/shared/utils/progressStorage';

interface QuizQuestionInput {
  id?: string;
  question?: string;
  text?: string;
  options?: (string | { id?: string; text?: string; content?: string; letter?: string })[];
  correct_answer?: number;
  correctAnswer?: number | string;
  explanation?: string;
  difficulty?: string;
}

interface QuizInput {
  question?: string;
  options?: (string | { id?: string; text?: string; content?: string; letter?: string })[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: string;
  questions?: QuizQuestionInput[];
  rewards?: { xp?: number; coins?: number };
}

export interface LessonQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result?: { correct: number; total: number }) => void;
  questions?: QuizQuestionInput[];
  quiz?: QuizInput;
  lessonId?: string | null;
  lessonTitle?: string;
  lessonXp?: number;
  lessonCoins?: number;
}

export const LessonQuizModal = ({
  isOpen,
  onClose,
  onComplete,
  questions,
  quiz,
  lessonId,
  lessonTitle,
  lessonXp,
  lessonCoins,
}: LessonQuizModalProps) => {
  const { user } = useAuth();
  const overlayRef = useGSAPModalEntrance({
    isOpen,
    type: 'fade',
    duration: 0.2,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [rewards, setRewards] = useState<{ xp: number; coins: number } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  // Normalize MCQ options from various API shapes
  const normalizeOptions = (options: unknown): { id: string; text: string }[] => {
    if (!Array.isArray(options) || options.length === 0) {
      return [];
    }

    // String[] → { id, text } with a,b,c ids
    if (typeof options[0] === 'string') {
      return options.map((opt, i) => ({
        id: String.fromCharCode(97 + i),
        text: opt,
      }));
    }

    // Object[] → normalized rows
    return options.map((opt: unknown, i: number) => {
      if (typeof opt === 'string') {
        return { id: String.fromCharCode(97 + i), text: opt };
      }
      const o = opt as Record<string, unknown>;
      return {
        id: String(o?.id ?? o?.letter ?? String.fromCharCode(97 + i)),
        text: String(o?.text ?? o?.content ?? opt),
      };
    });
  };

  // Build a single question list (several legacy formats)
  const normalizedQuestions = React.useMemo(() => {
    // Priority 1: top-level questions[]
    if (questions && Array.isArray(questions) && questions.length > 0) {
      return questions.map((q, index) => {
        const options = normalizeOptions(q.options);

        // Map numeric correct_answer index → option id
        const correctAnswerIndex =
          typeof q.correct_answer === 'number'
            ? q.correct_answer
            : typeof q.correctAnswer === 'number'
              ? q.correctAnswer
              : null;

        let correctAnswer;
        if (correctAnswerIndex !== null && options[correctAnswerIndex]) {
          correctAnswer = options[correctAnswerIndex].id;
        } else if (q.correctAnswer) {
          correctAnswer = q.correctAnswer;
        } else if (options.length > 0) {
          correctAnswer = options[0].id;
        } else {
          correctAnswer = 'a';
        }

        return {
          id: q.id || `question_${index}`,
          question: q.question || q.text || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'media',
        };
      });
    }
    // Priority 2: quiz.questions[]
    else if (quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      return quiz.questions.map((q, index) => {
        const options = normalizeOptions(q.options);

        const correctAnswerIndex =
          typeof q.correct_answer === 'number'
            ? q.correct_answer
            : typeof q.correctAnswer === 'number'
              ? q.correctAnswer
              : null;

        let correctAnswer;
        if (correctAnswerIndex !== null && options[correctAnswerIndex]) {
          correctAnswer = options[correctAnswerIndex].id;
        } else if (q.correctAnswer) {
          correctAnswer = q.correctAnswer;
        } else if (options.length > 0) {
          correctAnswer = options[0].id;
        } else {
          correctAnswer = 'a';
        }

        return {
          id: q.id || `quiz_question_${index}`,
          question: q.question || q.text || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'media',
        };
      });
    }
    // Priority 3: legacy single-question quiz object
    else if (quiz) {
      const options = normalizeOptions(quiz.options);

      let correctAnswer;
      if (quiz.correctAnswer) {
        correctAnswer = quiz.correctAnswer;
      } else if (options.length > 0) {
        correctAnswer = options[0].id;
      } else {
        correctAnswer = 'a';
      }

      return [
        {
          id: 'quiz_1',
          question: quiz.question || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: quiz.explanation || '',
          difficulty: quiz.difficulty || 'media',
        },
      ];
    }

    return [];
  }, [questions, quiz]);

  const currentQuestion = normalizedQuestions[currentQuestionIndex];
  const totalQuestions = normalizedQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = completedQuestions.size === totalQuestions;

  useEffect(() => {
    if (isOpen && user && lessonId) {
      checkCompletionStatus();
    }
    // Reset state when modal opens
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setRewards(null);
      setAnswers({});
      setCompletedQuestions(new Set());
    }
  }, [isOpen, user, lessonId]);

  // Sync local UI when navigating between questions
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers[currentQuestion.id];
      const isCompleted = completedQuestions.has(currentQuestion.id);
      setSelectedOption(savedAnswer || null);
      setIsSubmitted(isCompleted);
      setIsCorrect(savedAnswer === currentQuestion.correctAnswer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQuestion?.id]);

  const checkCompletionStatus = async () => {
    try {
      const completedLessons = getCompletedLessons();
      const wasCompleted = lessonId ? completedLessons.includes(lessonId) : false;
      setAlreadyCompleted(wasCompleted);
      console.log('Estado de completitud de lección:', {
        lessonId,
        wasCompleted,
        completedLessons,
      });
    } catch (error) {
      console.error('Error checking completion status:', error);
      // On error, allow retry (treat as not completed)
      setAlreadyCompleted(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || loading || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Persist this answer in the map
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(updatedAnswers);
    if (currentQuestion.id) setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));

    // All prompts answered?
    const allQuestionsAnswered = normalizedQuestions.every((q) => {
      return updatedAnswers[q.id] !== undefined && updatedAnswers[q.id] !== null;
    });

    // All answers correct (including this one)?
    const allCorrect = normalizedQuestions.every((q) => {
      const answer = updatedAnswers[q.id];
      return answer === q.correctAnswer;
    });

    console.log('Estado del quiz:', {
      isLastQuestion,
      allQuestionsAnswered,
      allCorrect,
      alreadyCompleted,
      totalQuestions,
      answersCount: Object.keys(updatedAnswers).length,
      completedQuestionsCount: completedQuestions.size,
      updatedAnswers,
    });

    // Award on last question when fully answered and not already rewarded
    if (isLastQuestion && allQuestionsAnswered && !alreadyCompleted && user?.uid) {
      setLoading(true);
      try {
        // Rewards: lesson props > quiz.rewards > defaults (500/250)
        const xpAmount = lessonXp ?? quiz?.rewards?.xp ?? 500;
        const coinsAmount = lessonCoins ?? quiz?.rewards?.coins ?? 250;

        console.log('=== OTORGANDO RECOMPENSAS ===');
        console.log('Datos:', {
          xpAmount,
          coinsAmount,
          lessonXp,
          lessonCoins,
          quizRewards: quiz?.rewards,
          allCorrect,
          allQuestionsAnswered,
          userId: user.uid,
          lessonId,
        });

        // Grant XP and coins
        console.log('Llamando addXP...');
        const xpResult = await gamificationPersistence.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        console.log('XP otorgado:', xpResult);

        console.log('Llamando addCoins...');
        const coinsResult = await gamificationPersistence.addCoins(
          user.uid,
          coinsAmount,
          `lesson_quiz_${lessonId ?? 'unknown'}`
        );
        console.log('Monedas otorgadas:', coinsResult);

        console.log('Resultados de recompensas:', { xpResult, coinsResult });

        // Mark lesson completed in local storage
        console.log('Marcando lección como completada...');
        if (user?.uid && lessonId) markLessonAsCompleted(user.uid, lessonId);
        console.log('Lección marcada como completada');

        setRewards({ xp: xpAmount, coins: coinsAmount });
        setAlreadyCompleted(true);
        console.log('=== RECOMPENSAS OTORGADAS EXITOSAMENTE ===');
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('=== ERROR OTORGANDO RECOMPENSAS ===', error);
        console.error('Detalles del error:', {
          message: error.message,
          stack: error.stack,
          userId: user?.uid,
          lessonId,
          xpAmount: lessonXp ?? quiz?.rewards?.xp ?? 500,
          coinsAmount: lessonCoins ?? quiz?.rewards?.coins ?? 250,
        });
        // Could surface a toast here
      }
      setLoading(false);
    } else if (totalQuestions === 1 && correct && !alreadyCompleted && user?.uid) {
      // Single-question quiz: award as soon as correct
      setLoading(true);
      try {
        // Rewards: lesson props > quiz.rewards > defaults (500/250)
        const xpAmount = lessonXp ?? quiz?.rewards?.xp ?? 500;
        const coinsAmount = lessonCoins ?? quiz?.rewards?.coins ?? 250;

        console.log('Otorgando recompensas (pregunta única):', {
          xpAmount,
          coinsAmount,
          lessonXp,
          lessonCoins,
          quizRewards: quiz?.rewards,
          userId: user.uid,
          lessonId,
        });

        // Grant XP and coins
        const xpResult = await gamificationPersistence.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        const coinsResult = await gamificationPersistence.addCoins(
          user.uid,
          coinsAmount,
          `lesson_quiz_${lessonId ?? 'unknown'}`
        );

        console.log('Resultados de recompensas (pregunta única):', {
          xpResult,
          coinsResult,
        });

        // Mark lesson completed in local storage
        if (user?.uid && lessonId) markLessonAsCompleted(user.uid, lessonId);

        setRewards({ xp: xpAmount, coins: coinsAmount });
        setAlreadyCompleted(true);
      } catch (err) {
        console.error('Error awarding rewards:', err);
      }
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!isOpen || !currentQuestion) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-70 flex items-end justify-center bg-black/80 p-0 pb-20 backdrop-blur-sm lg:items-center lg:p-4 lg:pb-4"
    >
      <div
        className={cn(
          'flex max-h-[calc(95vh-5rem)] w-full max-w-lg scale-100 transform flex-col overflow-hidden',
          'rounded-t-2xl border-t border-slate-800 bg-slate-900 shadow-2xl transition-all',
          'lg:max-h-[90vh] lg:rounded-2xl lg:border'
        )}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-800 bg-slate-800/50 p-3.5 lg:p-6">
          <div className="mb-1 flex items-center justify-center gap-2">
            <Icon name="trophy" size="lg" className="text-base text-yellow-400 lg:text-lg" />
            <h3 className="text-center text-base font-bold text-white lg:text-xl">Prueba de Conocimiento</h3>
          </div>
          <p className="mt-1.5 line-clamp-2 text-center text-xs text-slate-400 lg:text-sm">{lessonTitle}</p>
          {totalQuestions > 1 && (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {/* Progress bar */}
              <div className="h-1.5 max-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-700/50">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-slate-400">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div
          className={cn(
            'scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent min-h-0 flex-1',
            'overflow-x-hidden overflow-y-auto p-3.5 lg:p-6'
          )}
        >
          <div className="mb-3 lg:mb-6">
            <h4 className="mb-3 px-0.5 text-base leading-relaxed font-semibold text-white lg:mb-4 lg:text-lg">
              {currentQuestion.question}
            </h4>

            <div className="space-y-2 lg:space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => !isSubmitted && setSelectedOption(option.id)}
                  disabled={isSubmitted}
                  className={cn(
                    'relative min-h-[52px] w-full cursor-pointer rounded-xl border-2 p-3.5 text-left text-sm transition-all',
                    'lg:min-h-[48px] lg:rounded-xl lg:p-4 lg:text-base',
                    isSubmitted
                      ? option.id === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500/15 text-green-300 shadow-lg shadow-green-500/10'
                        : option.id === selectedOption
                          ? 'border-red-500 bg-red-500/15 text-red-300 shadow-lg shadow-red-500/10'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-500 opacity-60'
                      : selectedOption === option.id
                        ? 'scale-[1.02] border-blue-500 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/10'
                        : 'border-slate-700/50 bg-slate-800/50 text-slate-200 hover:border-slate-600 hover:bg-slate-800/70 active:scale-[0.98] active:bg-slate-700'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Letter badge (A, B, C…) */}
                    <div
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold lg:h-7 lg:w-7 lg:text-sm',
                        isSubmitted
                          ? option.id === currentQuestion.correctAnswer
                            ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                            : option.id === selectedOption
                              ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                              : 'border border-slate-600/50 bg-slate-700/50 text-slate-500'
                          : selectedOption === option.id
                            ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                            : 'border border-slate-600/50 bg-slate-700/50 text-slate-400'
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="flex-1 leading-snug wrap-break-word">{option.text}</span>
                      {isSubmitted && option.id === currentQuestion.correctAnswer && (
                        <Icon name="check" size="xl" className="ml-2 shrink-0 text-lg text-green-400 lg:text-xl" />
                      )}
                      {isSubmitted && option.id === selectedOption && option.id !== currentQuestion.correctAnswer && (
                        <Icon name="times" size="xl" className="ml-2 shrink-0 text-lg text-red-400 lg:text-xl" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {isSubmitted && currentQuestion.explanation && (
              <div className="mt-3 rounded-r-lg border-l-4 border-blue-500 bg-blue-500/10 p-3.5 lg:mt-4 lg:rounded-xl lg:p-4">
                <p className="text-xs leading-relaxed text-blue-200 lg:text-sm">
                  <strong className="mb-1.5 block text-blue-300">💡 Explicación:</strong>
                  <span className="block">{currentQuestion.explanation}</span>
                </p>
              </div>
            )}
          </div>

          {/* Feedback & Rewards */}
          {isSubmitted && (
            <div
              className={cn(
                'mb-3 rounded-xl border-2 p-3.5 text-center lg:mb-6 lg:rounded-xl lg:p-4',
                isCorrect
                  ? 'border-green-500/30 bg-linear-to-br from-green-500/15 to-green-600/5 shadow-lg shadow-green-500/5'
                  : 'border-red-500/30 bg-linear-to-br from-red-500/15 to-red-600/5 shadow-lg shadow-red-500/5'
              )}
            >
              <div className="mb-2 flex items-center justify-center gap-2">
                {isCorrect ? (
                  <Icon name="check" size="2xl" className="text-xl text-green-400 lg:text-2xl" />
                ) : (
                  <Icon name="times" size="2xl" className="text-xl text-red-400 lg:text-2xl" />
                )}
                <h5 className={cn('text-lg font-bold lg:text-xl', isCorrect ? 'text-green-300' : 'text-red-300')}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </h5>
              </div>

              {isCorrect && rewards && isLastQuestion && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 lg:gap-4">
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/15 px-3',
                      'py-1.5 text-sm font-bold text-yellow-300 shadow-md lg:px-4 lg:py-2 lg:text-base'
                    )}
                  >
                    <Icon name="coins" size="md" className="text-sm lg:text-base" />
                    <span>+{rewards.coins}</span>
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/15 px-3 py-1.5',
                      'text-sm font-bold text-blue-300 shadow-md lg:px-4 lg:py-2 lg:text-base'
                    )}
                  >
                    <Icon name="star" size="md" className="text-sm lg:text-base" />
                    <span>+{rewards.xp} XP</span>
                  </div>
                </div>
              )}

              {isCorrect && alreadyCompleted && !rewards && isLastQuestion && (
                <p className="mt-2 text-xs text-slate-300 lg:text-sm">Ya has completado esta lección anteriormente.</p>
              )}

              {!isCorrect && (
                <p className="mt-2 px-2 text-xs leading-relaxed text-slate-300 lg:text-sm">
                  {isLastQuestion
                    ? 'Inténtalo de nuevo para ganar tus recompensas.'
                    : 'Continúa con la siguiente pregunta.'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-900/95 p-3 pt-2 backdrop-blur-sm lg:p-6 lg:pt-0">
          <div className="flex gap-2 lg:gap-3">
            {/* Previous */}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className={cn(
                  'min-h-[48px] cursor-pointer rounded-xl bg-slate-800/80 px-3.5 py-3 font-bold',
                  'text-slate-300 shadow-md transition-all hover:bg-slate-700 active:scale-95',
                  'active:bg-slate-600 lg:min-h-[44px] lg:rounded-xl lg:px-4'
                )}
                aria-label="Pregunta anterior"
              >
                <Icon name="arrow-left" size="lg" className="text-base lg:text-lg" />
              </button>
            )}

            {/* Close / cancel */}
            <button
              onClick={() => {
                // Successful completion: also notify parent (closes lesson modal)
                if (isLastQuestion && (isCorrect || allQuestionsAnswered) && onComplete) {
                  onComplete({
                    correct: Object.keys(answers).filter(
                      (k) => answers[k] === normalizedQuestions.find((q) => q.id === k)?.correctAnswer
                    ).length,
                    total: totalQuestions,
                  });
                } else {
                  onClose();
                }
              }}
              className={cn(
                'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-slate-800/80 px-3 py-3 text-sm',
                'font-semibold text-slate-300 shadow-md transition-all hover:bg-slate-700 active:scale-95',
                'active:bg-slate-600 lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base'
              )}
            >
              {isLastQuestion && (isCorrect || allQuestionsAnswered) ? 'Cerrar' : 'Cancelar'}
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || loading}
                className={cn(
                  'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-blue-500',
                  'px-3 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all',
                  'hover:from-blue-500 hover:to-blue-400 active:scale-95 active:from-blue-700',
                  'active:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50',
                  'disabled:active:scale-100 lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span className="hidden lg:inline">Verificando...</span>
                    <span className="lg:hidden">Verificando</span>
                  </span>
                ) : (
                  'Enviar'
                )}
              </button>
            ) : (
              <>
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedOption(null);
                    }}
                    className={cn(
                      'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold',
                      'text-white shadow-md transition-all hover:bg-slate-600 active:scale-95 active:bg-slate-500',
                      'lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base'
                    )}
                  >
                    Reintentar
                  </button>
                )}
                {isCorrect && !isLastQuestion && (
                  <button
                    onClick={handleNextQuestion}
                    className={cn(
                      'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-linear-to-r from-green-600 to-green-500',
                      'px-3 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all',
                      'hover:from-green-500 hover:to-green-400 active:scale-95 active:from-green-700',
                      'active:to-green-600 lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base'
                    )}
                  >
                    <span className="hidden lg:inline">Siguiente </span>
                    <span className="lg:hidden">Sig.</span>
                    <Icon name="arrow-right" size="md" className="ml-1 text-sm lg:ml-2 lg:text-base" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
