import { cn } from '@/utils/cn';
import { ExamAnswerOptions } from '@/features/exam/components/ExamAnswerOptions';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

type FullExamQuestionCardProps = {
  question: ExamQuestionPublic;
  index: number;
  answer?: string;
  onAnswer: (questionId: string, answer: string) => void;
};

export function FullExamQuestionCard({ question, index, answer, onAnswer }: FullExamQuestionCardProps) {
  return (
    <div
      id={`question-${index}`}
      className={cn(
        'border-surface-border bg-surface-elevated/80 scroll-mt-[var(--exam-sticky-offset,6.25rem)] rounded-xl border shadow-lg',
        'hover:border-surface-border/80 backdrop-blur-md transition-all duration-300 hover:shadow-xl',
        'p-3.5 sm:p-6'
      )}
    >
      <div className="mb-3 flex items-start gap-2.5 sm:mb-5 sm:gap-4">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r sm:h-10 sm:w-10',
            'from-cta-from to-cta-progress-end text-xs font-bold text-white sm:text-sm'
          )}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-on-surface text-base leading-snug font-semibold sm:text-lg sm:leading-relaxed">
            {question.text}
          </p>
          <p className="text-on-surface-muted mt-1.5 text-xs sm:mt-2">
            Dificultad: <span className="text-app-accent font-medium">{question.difficulty}</span>
          </p>
        </div>
      </div>

      <ExamAnswerOptions
        questionId={question.id}
        questionNumber={index + 1}
        options={question.options}
        selectedAnswer={answer}
        onSelect={onAnswer}
        responsive
        selectedClassName="border-app-accent bg-app-ring/20 text-app-accent-strong"
        unselectedClassName="border-surface-border bg-surface-overlay/40 text-on-surface hover:border-app-accent/50 hover:bg-app-ring/10"
        optionClassName="focus-visible:ring-offset-surface-via"
      />
    </div>
  );
}
