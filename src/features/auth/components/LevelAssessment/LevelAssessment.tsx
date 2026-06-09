'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MASCOT_IMAGES } from '@/assets';
import { OnboardingIntroStage } from '@/features/auth/components/OnboardingQuiz/OnboardingIntroStage';
import { getPathForSkillLevel } from '@/features/auth/constants/skillLevelRoutes';
import type { LevelAssessmentContext, SkillLevel } from '@/features/auth/types/skillLevel';
import {
  getAssessmentOptionsFromContext,
  getAssessmentScope,
  persistLevelAssessment,
} from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LEVEL_ASSESSMENT_INTRO } from './data';
import { LevelAssessmentLevelPickStage } from './LevelAssessmentLevelPickStage';

type LevelAssessmentProps = {
  context: LevelAssessmentContext;
};

type Stage = 'intro' | 'levels';

export function LevelAssessment({ context }: LevelAssessmentProps) {
  const router = useRouter();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const { user } = useAuth();

  const [stage, setStage] = useState<Stage>('intro');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const scope = getAssessmentScope(getAssessmentOptionsFromContext(context, demoMode, user?.uid));

  const handleConfirmLevel = async () => {
    if (!selectedLevel || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    const result = {
      level: selectedLevel,
      completedAt: new Date().toISOString(),
    };

    try {
      await persistLevelAssessment(scope, result, user?.uid);
      router.replace(getPathForSkillLevel(selectedLevel));
    } catch (err) {
      console.error('Error guardando nivel de preparación:', err);
      setSaveError('No se pudo guardar tu nivel. Revisa tu conexión e intenta de nuevo.');
      setIsSaving(false);
    }
  };

  if (stage === 'intro') {
    return (
      <OnboardingIntroStage
        message={LEVEL_ASSESSMENT_INTRO.message}
        description={LEVEL_ASSESSMENT_INTRO.description}
        avatarSrc={MASCOT_IMAGES.logo}
        onBack={() => router.push('/')}
        onNext={() => setStage('levels')}
      />
    );
  }

  return (
    <LevelAssessmentLevelPickStage
      selectedLevel={selectedLevel}
      isSaving={isSaving}
      saveError={saveError}
      onSelectLevel={setSelectedLevel}
      onBack={() => setStage('intro')}
      onConfirm={() => void handleConfirmLevel()}
    />
  );
}
