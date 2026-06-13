import type { Metadata } from 'next';
import { HomePage } from '@/features/home/pages/HomePage';
import { HomeStructuredData } from '@/features/home/seo/HomeStructuredData';
import { contentPageTwitter } from '@/config/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'ICFES Master | Domina el ICFES desde cero',
    description:
      'Prepárate para el ICFES con +500 preguntas, simulacros reales, gamificación y una ruta de aprendizaje guiada.',
  },
  twitter: contentPageTwitter(
    'ICFES Master | Domina el ICFES desde cero',
    'Prepárate para el ICFES con +500 preguntas, simulacros reales, gamificación y una ruta de aprendizaje guiada.'
  ),
};

export default function RootPage() {
  return (
    <>
      <HomeStructuredData />
      <HomePage />
    </>
  );
}
