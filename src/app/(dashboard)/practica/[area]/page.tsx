import ProtectedPage from '@/components/ProtectedPage';
import { PracticePage } from '@/features/exam/pages';
import { PRACTICA_AREA_SLUGS } from '@/shared/constants/practiceAreas';

export function generateStaticParams() {
  return PRACTICA_AREA_SLUGS.map((area) => ({ area }));
}

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <PracticePage />
    </ProtectedPage>
  );
}
