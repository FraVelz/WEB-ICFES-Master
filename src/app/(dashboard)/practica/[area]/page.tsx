import DemoProtectedPage from '@/components/DemoProtectedPage';
import { PracticePage } from '@/features/exam/pages';
import { PRACTICA_AREA_SLUGS } from '@/features/learning/constants/practiceDynamicRoutes';

export function generateStaticParams() {
  return PRACTICA_AREA_SLUGS.map((area) => ({ area }));
}

export default function Page() {
  return (
    <DemoProtectedPage>
      <PracticePage />
    </DemoProtectedPage>
  );
}
