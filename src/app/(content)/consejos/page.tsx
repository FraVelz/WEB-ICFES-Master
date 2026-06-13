import type { Metadata } from 'next';
import { TipsPage } from '@/features/tips/pages/TipsPage';
import { PageStructuredData } from '@/features/home/seo/PageStructuredData';
import { contentPageTwitter } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Consejos de preparación ICFES',
  description: 'Consejos prácticos de estudio, gestión del tiempo y estrategias para el día del examen ICFES.',
  alternates: { canonical: '/consejos/' },
  openGraph: {
    url: '/consejos/',
    title: 'Consejos ICFES | ICFES Master',
    description: 'Guías de preparación para dominar el ICFES con método y constancia.',
    type: 'article',
  },
  twitter: contentPageTwitter(
    'Consejos ICFES | ICFES Master',
    'Guías de preparación para dominar el ICFES con método y constancia.'
  ),
};

export default function Page() {
  return (
    <>
      <PageStructuredData
        title="Consejos de preparación ICFES"
        description="Consejos prácticos de estudio, gestión del tiempo y estrategias para el día del examen ICFES."
        path="/consejos/"
        breadcrumbs={[
          { name: 'Inicio', path: '/' },
          { name: 'Lectura', path: '/lectura/' },
          { name: 'Consejos', path: '/consejos/' },
        ]}
      />
      <TipsPage />
    </>
  );
}
