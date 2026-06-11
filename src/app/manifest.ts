import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ICFES Master',
    short_name: 'ICFES Master',
    description: 'Prepárate para el ICFES con simulacros, gamificación y ruta de aprendizaje guiada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#2563eb',
    lang: 'es-CO',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon/',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon/',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    id: getSiteUrl(),
  };
}
