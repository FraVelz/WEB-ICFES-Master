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
        src: '/icon.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    id: getSiteUrl(),
  };
}
