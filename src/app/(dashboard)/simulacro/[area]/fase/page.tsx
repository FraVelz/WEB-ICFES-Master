import ProtectedPage from '@/components/ProtectedPage';
import { PhaseSkipExamPage } from '@/features/learning/pages/PhaseSkipExamPage';
import { isPracticaAreaSlug } from '@/shared/constants/practiceAreas';
import { SIMULACRO_PATH } from '@/features/exam/utils/simulacroNavigation';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ExamPageSkeleton } from '@/shared/components/PageSkeletons';

type PageProps = {
  params: Promise<{ area: string }>;
};

export default async function Page({ params }: PageProps) {
  const { area } = await params;
  if (!isPracticaAreaSlug(area)) {
    redirect(SIMULACRO_PATH);
  }

  return (
    <ProtectedPage blockDemoContent>
      <Suspense fallback={<ExamPageSkeleton questionCount={5} />}>
        <PhaseSkipExamPage />
      </Suspense>
    </ProtectedPage>
  );
}
