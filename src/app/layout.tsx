import type { Metadata } from 'next';

import './globals.css';
import '@/styles/scrollAnimations.css';

import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: 'ICFES Master | Domina el ICFES desde cero',
    template: '%s | ICFES Master',
  },
  description:
    'Preparate para el ICFES con +500 preguntas, simulacros reales, gamificacion y una ruta de aprendizaje guiada.',
  applicationName: 'ICFES Master',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'ICFES',
    'preicfes',
    'simulacros ICFES',
    'preguntas ICFES',
    'preparacion ICFES',
    'Saber 11',
    'estudiar ICFES',
  ],
  authors: [{ name: 'ICFES Master' }],
  creator: 'ICFES Master',
  publisher: 'ICFES Master',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'ICFES Master',
    title: 'Domina el ICFES desde Cero | ICFES Master',
    description:
      'La plataforma #1 para preparar el ICFES: +500 preguntas, simulacros reales y aprendizaje guiado.',
    url: '/',
    images: [
      {
        url: 'https://github.com/FraVelz/WEB-ICFES-Master/blob/main/public/images/screenshot.png?raw=true',
        width: 1280,
        height: 720,
        alt: 'ICFES Master - Domina el ICFES desde Cero',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domina el ICFES desde Cero | ICFES Master',
    description:
      'Preparate con simulacros y preguntas reales para lograr un gran puntaje en el ICFES.',
    images: [
      'https://github.com/FraVelz/WEB-ICFES-Master/blob/main/public/images/screenshot.png?raw=true',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/x-icon" href="/logo.ico" />
        <meta name="color-scheme" content="dark" />
      </head>

      <body className="m-0 p-0 box-border min-h-dvh bg-black text-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
