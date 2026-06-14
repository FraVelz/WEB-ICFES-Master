import ProtectedPage from '@/components/ProtectedPage';
import { LearningPhasesPage } from '@/features/learning/pages/LearningPhasesPage';
import { getLearningPhasesHref, isPhasesAreaSlug, PHASES_AREA_SLUGS } from '@/features/learning/data/competencyPhases';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PhasesPageSkeleton } from '@/shared/components/PageSkeletons';

type PageProps = {
  params: Promise<{ area: string }>;
};

export function generateStaticParams() {
  return PHASES_AREA_SLUGS.map((area) => ({ area }));
}

export default async function Page({ params }: PageProps) {
  const { area } = await params;
  if (!isPhasesAreaSlug(area)) {
    redirect(getLearningPhasesHref());
  }

  return (
    <ProtectedPage blockDemoContent={false}>
      <Suspense fallback={<PhasesPageSkeleton />}>
        <LearningPhasesPage />
      </Suspense>
    </ProtectedPage>
  );
}
