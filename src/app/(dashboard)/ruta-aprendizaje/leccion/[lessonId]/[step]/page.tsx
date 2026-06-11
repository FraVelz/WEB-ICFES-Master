import ProtectedPage from '@/components/ProtectedPage';
import { LessonStepPage } from '@/features/learning/pages/LessonStepPage';
import { Suspense } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';

type PageProps = {
  params: Promise<{ lessonId: string; step: string }>;
};

export default async function Page({ params }: PageProps) {
  const { lessonId, step } = await params;

  return (
    <ProtectedPage blockDemoContent={false}>
      <Suspense fallback={<LoadingState label="Cargando lección..." layout="section" />}>
        <LessonStepPage lessonId={lessonId} stepSlug={step} />
      </Suspense>
    </ProtectedPage>
  );
}
