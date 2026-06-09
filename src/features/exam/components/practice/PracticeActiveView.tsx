import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AnswerSheet } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion } from '@/features/exam/types/question';
import { PracticeExamHeader } from './PracticeExamHeader';

type PracticeActiveViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestion[];
  answers: Record<string, string>;
  showResults: boolean;
  timeRemaining: number | null;
  timeColor: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  showAnswerSheetMobile: boolean;
  setShowAnswerSheetMobile: (open: boolean) => void;
  onAnswer: (questionId: string, answer: string) => void;
  onScrollToQuestion: (index: number) => void;
  onFinish: () => void;
};

export function PracticeActiveView({
  areaInfo,
  examConfig,
  questions,
  answers,
  showResults,
  timeRemaining,
  timeColor,
  mobileMenuOpen,
  setMobileMenuOpen,
  showAnswerSheetMobile,
  setShowAnswerSheetMobile,
  onAnswer,
  onScrollToQuestion,
  onFinish,
}: PracticeActiveViewProps) {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-lesson-lc-glow-a/20 absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <PracticeExamHeader
          areaName={areaInfo.name}
          areaColor={areaInfo.color}
          subtitle={`Preguntas: ${questions.length}`}
          timeRemaining={timeRemaining}
          timeColor={timeColor}
          showTimer={examConfig.useTimer}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onShowAnswerSheet={() => {
            setShowAnswerSheetMobile(true);
            setMobileMenuOpen(false);
          }}
        />

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
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
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r',
                          'from-cta-from to-cta-progress-end text-sm font-bold'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg leading-relaxed font-semibold text-white">{question.text}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Dificultad: <span className="text-app-accent-muted">{question.difficulty}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-14 space-y-3">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.letter;
                      return (
                        <button
                          type="button"
                          key={option.letter}
                          onClick={() => onAnswer(question.id, option.letter ?? option.id)}
                          className={cn(
                            'w-full rounded-lg border-2 p-4 text-left transition-all duration-300',
                            'focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                            'focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                            isSelected
                              ? 'border-app-accent bg-app-ring/20 text-app-on-accent'
                              : 'hover:border-app-accent/50 hover:bg-app-ring/10 border-white/20 bg-white/5 text-white'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
                                isSelected ? 'border-app-accent bg-app-ring text-white' : 'border-white/30'
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

                  {showResults && examConfig.showExplanations && answers[question.id] && (
                    <div className="mt-6 ml-14 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                      <p className="mb-2 text-xs font-semibold text-blue-300">EXPLICACIÓN:</p>
                      <p className="text-sm text-gray-200">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-center pt-8">
                <button
                  type="button"
                  onClick={onFinish}
                  className={cn(
                    'rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-12 py-4 text-lg font-bold',
                    'text-white transition-all duration-300 hover:from-green-600 hover:to-emerald-600',
                    'cursor-pointer hover:shadow-lg hover:shadow-green-500/50',
                    'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                    'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
                  )}
                >
                  Finalizar Examen
                </button>
              </div>
            </div>

            <div>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={onScrollToQuestion}
                questions={questions}
              />
            </div>
          </div>
        </div>
      </div>

      {showAnswerSheetMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:hidden">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/20 bg-gray-800">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gray-900 p-4">
              <h3 className="font-bold text-white">Hoja de Respuestas</h3>
              <button
                type="button"
                onClick={() => setShowAnswerSheetMobile(false)}
                aria-label="Cerrar hoja de respuestas"
                className={cn(
                  'rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
                )}
              >
                <Icon name="x-mark" size="lg" />
              </button>
            </div>
            <div className="p-4">
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={(index) => {
                  onScrollToQuestion(index);
                  setShowAnswerSheetMobile(false);
                }}
                questions={questions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
