import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LevelAssessmentPage } from '@/features/auth/pages/LevelAssessmentPage';
import { OnboardingPageSkeleton } from '@/shared/components/PageSkeletons';

export const metadata: Metadata = {
  title: 'Evaluación de nivel',
  description: 'Responde unas preguntas para personalizar tu ruta de aprendizaje en ICFES Master.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<OnboardingPageSkeleton />}>
      <LevelAssessmentPage />
    </Suspense>
  );
}
