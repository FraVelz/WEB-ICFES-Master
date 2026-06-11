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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:hidden">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/20 bg-gray-800">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gray-900 p-4">
          <h3 className="font-bold text-white">Hoja de Respuestas</h3>
          <button
            type="button"
            onClick={onClose}
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
              onClose();
            }}
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
