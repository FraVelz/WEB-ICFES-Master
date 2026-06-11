import type { Metadata } from 'next';
import { HomePage } from '@/features/home/pages/HomePage';
import { HomeStructuredData } from '@/features/home/seo/HomeStructuredData';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Domina el ICFES desde Cero | ICFES Master',
    description:
      'Prepárate para el ICFES con +500 preguntas, simulacros reales, gamificación y una ruta de aprendizaje guiada.',
  },
};

export default function RootPage() {
  return (
    <>
      <HomeStructuredData />
      <HomePage />
    </>
  );
}
