import type { Metadata } from 'next';
import { LecturaPage } from '@/features/lectura/pages/LecturaPage';
import { PageStructuredData } from '@/features/home/seo/PageStructuredData';
import { contentPageTwitter } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Lectura ICFES — Guías y recursos',
  description:
    'Material informativo sobre el ICFES, el bachillerato y cómo prepararte. Secciones de importancia, consejos e información oficial.',
  alternates: { canonical: '/lectura/' },
  openGraph: {
    url: '/lectura/',
    title: 'Lectura ICFES | ICFES Master',
    description: 'Explora guías de lectura sobre el ICFES y la preparación académica.',
    type: 'website',
  },
  twitter: contentPageTwitter(
    'Lectura ICFES | ICFES Master',
    'Explora guías de lectura sobre el ICFES y la preparación académica.'
  ),
};

export default function Page() {
  return (
    <>
      <PageStructuredData
        title="Lectura ICFES — Guías y recursos"
        description="Material informativo sobre el ICFES, el bachillerato y cómo prepararte."
        path="/lectura/"
        breadcrumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Lectura', path: '/lectura/' },
        ]}
      />
      <LecturaPage />
    </>
  );
}
