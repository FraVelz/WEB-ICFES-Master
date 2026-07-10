import type { Metadata } from 'next';
import { HomePage } from '@/features/home/pages/HomePage';
import { HomeStructuredData } from '@/features/home/seo/HomeStructuredData';
import { contentPageTwitter } from '@/config/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  description: 'Practica Saber 11° con más de 500 preguntas, simulacros cronometrados y seguimiento de progreso.',
  openGraph: {
    url: '/',
    title: 'ICFES Master | Simulacros y práctica Saber 11°',
    description: 'Practica Saber 11° con más de 500 preguntas, simulacros cronometrados y seguimiento de progreso.',
  },
  twitter: contentPageTwitter(
    'ICFES Master | Simulacros y práctica Saber 11°',
    'Practica Saber 11° con más de 500 preguntas, simulacros cronometrados y seguimiento de progreso.'
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
