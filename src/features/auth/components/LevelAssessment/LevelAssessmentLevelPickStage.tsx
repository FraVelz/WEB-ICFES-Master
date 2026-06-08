import { MASCOT_IMAGES } from '@/assets';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { OnboardingLayout } from '@/features/auth/components/OnboardingQuiz/OnboardingLayout';
import { SKILL_LEVEL_DESTINATIONS } from '@/features/auth/constants/skillLevelRoutes';
import type { SkillLevel } from '@/features/auth/types/skillLevel';
import { LEVEL_SELF_ASSESSMENT_QUESTION } from './data';

type LevelAssessmentLevelPickStageProps = {
  selectedLevel: SkillLevel | null;
  isSaving?: boolean;
  saveError?: string | null;
  onSelectLevel: (level: SkillLevel) => void;
  onBack: () => void;
  onConfirm: () => void;
};

const LEVEL_ORDER: SkillLevel[] = ['basics', 'intermediate', 'advanced'];

export function LevelAssessmentLevelPickStage({
  selectedLevel,
  isSaving = false,
  saveError = null,
  onSelectLevel,
  onBack,
  onConfirm,
}: LevelAssessmentLevelPickStageProps) {
  return (
    <OnboardingLayout>
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-md">
        <div className="flex h-16 items-center px-6">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-slate-800"
            title="Volver atrás"
          >
            <Icon name="chevron-left" className="text-app-accent text-xl" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <MascotaCircle src={MASCOT_IMAGES.pensativo} size="medium" alt="Zeus" centered={false} />
          </div>
          <div className="flex-1 pt-2 text-center sm:text-left">
            <h2 className="text-xl leading-tight font-bold text-white sm:text-2xl md:text-3xl">
              {LEVEL_SELF_ASSESSMENT_QUESTION}
            </h2>
            <p className="text-app-muted mt-3 text-sm leading-relaxed sm:text-base">
              Selecciona la opción que mejor refleje cómo te sientes hoy con el contenido del ICFES.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {LEVEL_ORDER.map((level) => {
            const meta = SKILL_LEVEL_DESTINATIONS[level];
            const selected = selectedLevel === level;

            return (
              <button
                type="button"
                key={level}
                disabled={isSaving}
                onClick={() => onSelectLevel(level)}
                className={cn(
                  'relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200',
                  selected
                    ? 'border-app-ring bg-app-ring/15 shadow-app-ring/20 shadow-lg'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                )}
              >
                <Icon name={meta.icon} className="text-app-accent mb-3 text-2xl" />
                <h3 className="text-lg font-bold text-white">{meta.title}</h3>
                <p className="text-app-muted mt-2 text-sm leading-relaxed">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="z-20 mx-auto w-full max-w-4xl space-y-3 p-6 pt-2">
        {saveError && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {saveError}
          </p>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={!selectedLevel || isSaving}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r',
            'from-cta-from to-cta-to px-6 py-4 text-lg font-bold text-white shadow-md transition-all',
            'hover:shadow-app-ring/50 duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSaving ? 'Guardando…' : 'Comenzar'}
          {!isSaving && <Icon name="rocket" />}
        </button>
      </div>
    </OnboardingLayout>
  );
}
