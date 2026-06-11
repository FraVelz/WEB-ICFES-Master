import ProtectedPage from '@/components/ProtectedPage';
import { LearningPhasesPage } from '@/features/learning/pages/LearningPhasesPage';
import { Suspense } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <Suspense fallback={<LoadingState label="Cargando fases..." layout="section" />}>
        <LearningPhasesPage />
      </Suspense>
    </ProtectedPage>
  );
}
