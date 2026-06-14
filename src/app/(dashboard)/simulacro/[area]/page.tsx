import ProtectedPage from '@/components/ProtectedPage';
import { PracticePage } from '@/features/exam/pages';
import { isPracticaAreaSlug } from '@/shared/constants/practiceAreas';
import { SIMULACRO_PATH } from '@/features/exam/utils/simulacroNavigation';
import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ area: string }>;
};

export default async function Page({ params }: PageProps) {
  const { area } = await params;
  if (!isPracticaAreaSlug(area)) {
    redirect(SIMULACRO_PATH);
  }

  return (
    <ProtectedPage>
      <PracticePage />
    </ProtectedPage>
  );
}
