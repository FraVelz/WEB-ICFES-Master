import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';

import 'katex/dist/katex.min.css';
import './globals.css';

import Providers from '@/components/Providers';
import { VercelMetrics } from '@/components/VercelMetrics';
import { ogImageOpenGraph, ogImageTwitter } from '@/config/ogImage';
import { getSiteUrl, getTwitterSite } from '@/config/site';
import { THEME_STORAGE_KEY } from '@/features/theme/themeStorage';

const themeInitScript =
  `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');` +
  `var d=t!=='light';document.documentElement.classList.toggle('dark',d);` +
  `document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'ICFES Master | Simulacros y práctica Saber 11°',
    template: '%s | ICFES Master',
  },
  description: 'Practica Saber 11° con más de 500 preguntas, simulacros cronometrados y seguimiento de progreso.',
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
    title: 'ICFES Master | Simulacros y práctica Saber 11°',
    description: 'Más de 500 preguntas, simulacros cronometrados y práctica por áreas para Saber 11°.',
    url: '/',
    ...ogImageOpenGraph,
  },
  twitter: {
    title: 'ICFES Master | Simulacros y práctica Saber 11°',
    description: 'Practica con simulacros y preguntas por materia para el ICFES.',
    ...(getTwitterSite() ? { site: getTwitterSite() } : {}),
    ...ogImageTwitter,
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
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
