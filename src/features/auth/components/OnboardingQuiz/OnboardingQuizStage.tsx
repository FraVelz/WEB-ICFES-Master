import { MASCOT_IMAGES } from '@/assets';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { OnboardingLayout } from './OnboardingLayout';

type OnboardingOption = { value: string; label: string };

type OnboardingQuizStageProps = {
  question: string;
  options: OnboardingOption[];
  isMultiple: boolean;
  currentAnswer: string | string[];
  progress: number;
  questionIndex: number;
  totalQuestions: number;
  canProceed: boolean;
  onBack: () => void;
  onSelectOption: (value: string) => void;
  onNext: () => void;
};

export function OnboardingQuizStage({
  question,
  options,
  isMultiple,
  currentAnswer,
  progress,
  questionIndex,
  totalQuestions,
  canProceed,
  onBack,
  onSelectOption,
  onNext,
}: OnboardingQuizStageProps) {
  return (
    <OnboardingLayout>
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-slate-800"
            title="Volver atrás"
          >
            <Icon name="chevron-left" className="text-app-accent text-xl" />
          </button>
          <div className="flex flex-1 items-center justify-center gap-6">
            <h3 className="hidden text-sm font-semibold text-slate-400 sm:block">
              Pregunta {questionIndex + 1} de {totalQuestions}
            </h3>
            <span className="text-app-accent text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="px-6 py-0">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="from-cta-from to-cta-to h-full bg-linear-to-r transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <MascotaCircle src={MASCOT_IMAGES.pensativo} size="medium" alt="Zeus - Tu asistente" centered={false} />
          </div>
          <div className="flex-1 pt-2 text-center sm:text-left">
            <h2 className="text-xl leading-tight font-bold text-white sm:text-2xl md:text-3xl">{question}</h2>
          </div>
        </div>

        <div className="w-full space-y-3">
          {options.map((option) => {
            const selected = isMultiple
              ? (Array.isArray(currentAnswer) ? currentAnswer : []).includes(option.value)
              : currentAnswer === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => onSelectOption(option.value)}
                className={cn(
                  'group flex w-full cursor-pointer items-center gap-4 rounded-xl ' +
                  'border-2 p-4 text-left font-semibold transition-all duration-200',
                  selected
                    ? 'border-app-ring bg-app-ring/20 shadow-app-ring/10 text-white shadow-lg'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-all',
                    selected ? 'border-app-ring bg-app-ring scale-110' : 'border-slate-600 group-hover:border-slate-400'
                  )}
                >
                  {selected && <Icon name="check" size="sm" className="text-white" />}
                </div>
                <span className="text-base sm:text-lg">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="z-20 mx-auto w-full max-w-4xl p-6 pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r',
            'from-cta-from to-cta-to px-6 py-4 text-lg font-bold text-white shadow-md transition-all',
            'hover:shadow-app-ring/50 duration-300 hover:shadow-lg disabled:cursor-not-allowed',
            'disabled:opacity-50'
          )}
        >
          {questionIndex === totalQuestions - 1 ? (
            <>
              Finalizar
              <Icon name="check-circle" />
            </>
          ) : (
            <>
              Continuar
              <Icon name="arrow-right" />
            </>
          )}
        </button>
      </div>
    </OnboardingLayout>
  );
}
