import type { Metadata } from 'next';
import ProtectedPage from '@/components/ProtectedPage';
import { RouteTo500Page } from '@/features/learning/pages/RouteTo500Page';

export const metadata: Metadata = {
  title: 'Ruta al 500 — Cómo prepararte por etapas',
  description:
    'Recorrido por competencias ICFES: fases de aprendizaje, simulacros por materia y examen global con marco ND 1–4.',
};

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <RouteTo500Page />
    </ProtectedPage>
  );
}
