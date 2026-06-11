import type { Metadata } from 'next';
import Script from 'next/script';

import './globals.css';

import Providers from '@/components/Providers';
import { VercelMetrics } from '@/components/VercelMetrics';
import { BRAND_IMAGES } from '@/assets';
import { getSiteUrl } from '@/config/site';
import { THEME_STORAGE_KEY } from '@/features/theme/themeStorage';

const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t!=='light';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
    description: 'La plataforma #1 para preparar el ICFES: +500 preguntas, simulacros reales y aprendizaje guiado.',
    url: '/',
    images: [
      {
        url: BRAND_IMAGES.screenshot.src,
        width: BRAND_IMAGES.screenshot.width,
        height: BRAND_IMAGES.screenshot.height,
        alt: 'ICFES Master - Domina el ICFES desde Cero',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domina el ICFES desde Cero | ICFES Master',
    description: 'Preparate con simulacros y preguntas reales para lograr un gran puntaje en el ICFES.',
    images: [BRAND_IMAGES.screenshot.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-surface text-on-surface m-0 box-border min-h-dvh p-0 font-sans antialiased">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>{children}</Providers>
        <VercelMetrics />
      </body>
    </html>
  );
}
