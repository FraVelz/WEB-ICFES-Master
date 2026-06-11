import type { Metadata } from 'next';
import { HomePage } from '@/features/home/pages/HomePage';
import { HomeStructuredData } from '@/features/home/seo/HomeStructuredData';
import { BRAND_IMAGES } from '@/assets';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Domina el ICFES desde Cero | ICFES Master',
    description:
      'Prepárate para el ICFES con +500 preguntas, simulacros reales, gamificación y una ruta de aprendizaje guiada.',
    images: [
      {
        url: BRAND_IMAGES.screenshot.src,
        width: BRAND_IMAGES.screenshot.width,
        height: BRAND_IMAGES.screenshot.height,
        alt: 'ICFES Master — plataforma de preparación ICFES',
      },
    ],
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
