import type { Metadata } from 'next';
import { InformacionPage } from '@/features/informacion/pages/InformacionPage';
import { PageStructuredData } from '@/features/home/seo/PageStructuredData';

export const metadata: Metadata = {
  title: 'Información oficial del ICFES',
  description:
    'Enlaces e infografías oficiales del Saber 11°: tarifas, fechas, inscripción y requisitos del ICFES.',
  alternates: { canonical: '/informacion/' },
  openGraph: {
    url: '/informacion/',
    title: 'Información del ICFES | ICFES Master',
    description: 'Recursos oficiales del ICFES para estudiantes y familias.',
    type: 'article',
  },
};

export default function Page() {
  return (
    <>
      <PageStructuredData
        title="Información oficial del ICFES"
        description="Enlaces e infografías oficiales del Saber 11°: tarifas, fechas, inscripción y requisitos del ICFES."
        path="/informacion/"
        breadcrumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Lectura', path: '/lectura/' },
          { name: 'Información', path: '/informacion/' },
        ]}
      />
      <InformacionPage />
    </>
  );
}
