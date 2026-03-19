import DemoProtectedPage from '@/components/DemoProtectedPage';
import { PracticePage } from '@/features/exam/pages';

const PRACTICA_AREAS = [
  { area: 'lectura-critica' },
  { area: 'matematicas' },
  { area: 'ciencias-naturales' },
  { area: 'sociales-ciudadanas' },
];

export function generateStaticParams() {
  return PRACTICA_AREAS;
}

export default function Page() {
  return (
    <DemoProtectedPage>
      <PracticePage />
    </DemoProtectedPage>
  );
}
