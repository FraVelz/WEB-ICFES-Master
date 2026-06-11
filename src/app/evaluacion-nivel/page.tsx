import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LevelAssessmentPage } from '@/features/auth/pages/LevelAssessmentPage';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LevelAssessmentPage />
    </Suspense>
  );
}
