import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';

import './globals.css';

import Providers from '@/components/Providers';
import { VercelMetrics } from '@/components/VercelMetrics';
import { ogImageOpenGraph, ogImageTwitter } from '@/config/ogImage';
import { getSiteUrl } from '@/config/site';
import { THEME_STORAGE_KEY } from '@/features/theme/themeStorage';

const themeInitScript =
  `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');` +
  `var d=t!=='light';document.documentElement.classList.toggle('dark',d);` +
  `document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'ICFES Master | Domina el ICFES desde cero',
    template: '%s | ICFES Master',
  },
  description:
    'Prepárate para el ICFES con +500 preguntas, simulacros reales, gamificación y una ruta de aprendizaje guiada.',
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
    title: 'ICFES Master | Domina el ICFES desde cero',
    description: 'La plataforma #1 para preparar el ICFES: +500 preguntas, simulacros reales y aprendizaje guiado.',
    url: '/',
    ...ogImageOpenGraph,
  },
  twitter: {
    title: 'ICFES Master | Domina el ICFES desde cero',
    description: 'Prepárate con simulacros y preguntas reales para lograr un gran puntaje en el ICFES.',
    ...ogImageTwitter,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-surface text-on-surface m-0 box-border min-h-dvh p-0 font-sans antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Providers>{children}</Providers>
        <VercelMetrics />
      </body>
    </html>
  );
}
