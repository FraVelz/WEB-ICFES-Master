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
        'rounded-xl border border-white/10 bg-linear-to-br from-gray-800/40 via-gray-900/40',
        'to-gray-950/40 shadow-lg backdrop-blur-md transition-all duration-300',
        'p-3.5 sm:p-6',
        'hover:border-white/20 hover:shadow-xl'
      )}
    >
      <div className="mb-3 flex items-start gap-2.5 sm:mb-5 sm:gap-4">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r sm:h-10 sm:w-10',
            'from-cta-from to-cta-progress-end text-xs font-bold sm:text-sm'
          )}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base leading-snug font-semibold text-white sm:text-lg sm:leading-relaxed">
            {question.text}
          </p>
          <p className="text-on-surface-muted mt-1.5 text-xs sm:mt-2">
            Dificultad: <span className="text-app-accent-muted">{question.difficulty}</span>
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
        selectedClassName="border-app-accent bg-app-ring/20 text-app-on-accent"
        unselectedClassName="hover:border-app-accent/50 hover:bg-app-ring/10 border-white/20 bg-white/5 text-white"
        optionClassName="focus-visible:ring-offset-gray-950"
      />
    </div>
  );
}
