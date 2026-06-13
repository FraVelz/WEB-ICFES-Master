import type { Metadata } from 'next';
import { ImportanciaPage } from '@/features/importancia/pages/ImportanciaPage';
import { PageStructuredData } from '@/features/home/seo/PageStructuredData';
import { contentPageTwitter } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Importancia del ICFES y el bachiller',
  description:
    'Por qué terminar el bachillerato y prepararte para el ICFES abre opciones en empleo, ingresos y proyectos de vida.',
  alternates: { canonical: '/importancia/' },
  openGraph: {
    url: '/importancia/',
    title: 'Importancia del ICFES | ICFES Master',
    description: 'Guía sobre la importancia del bachillerato y el examen ICFES en Colombia.',
    type: 'article',
  },
  twitter: contentPageTwitter(
    'Importancia del ICFES | ICFES Master',
    'Guía sobre la importancia del bachillerato y el examen ICFES en Colombia.'
  ),
};

export default function Page() {
  return (
    <>
      <PageStructuredData
        title="Importancia del ICFES y el bachiller"
        description="Por qué terminar el bachillerato y prepararte para el ICFES abre opciones en empleo, ingresos y proyectos de vida."
        path="/importancia/"
        breadcrumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Lectura', path: '/lectura/' },
          { name: 'Importancia', path: '/importancia/' },
        ]}
      />
      <ImportanciaPage />
    </>
  );
}
