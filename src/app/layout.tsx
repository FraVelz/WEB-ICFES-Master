import type { Metadata } from 'next';

import './globals.css';
import '@/styles/scrollAnimations.css';

import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ICFES Master',
  description: 'Plataforma de preparación para el examen ICFES',
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
