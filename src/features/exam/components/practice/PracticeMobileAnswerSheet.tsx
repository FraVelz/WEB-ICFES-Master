import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AnswerSheet } from '@/features/exam/components';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

type PracticeMobileAnswerSheetProps = {
  isOpen: boolean;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  onClose: () => void;
  onScrollToQuestion: (index: number) => void;
};

export function PracticeMobileAnswerSheet({
  isOpen,
  questions,
  answers,
  onClose,
  onScrollToQuestion,
}: PracticeMobileAnswerSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:hidden">
      <div className="border-surface-border bg-surface-elevated max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border">
        <div className="border-surface-border bg-surface-via sticky top-0 flex items-center justify-between border-b p-4">
          <h3 className="text-on-surface font-bold">Hoja de Respuestas</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar hoja de respuestas"
            className={cn(
              'text-on-surface-muted hover:bg-surface-overlay hover:text-on-surface rounded-lg px-3 py-2 transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
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
              onClose();
            }}
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
