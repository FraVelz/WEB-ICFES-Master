import { Suspense } from 'react';
import { LevelAssessmentPage } from '@/features/auth/pages/LevelAssessmentPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LevelAssessmentPage />
    </Suspense>
  );
}
