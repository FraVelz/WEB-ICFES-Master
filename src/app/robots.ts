import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/config/site';

const PRIVATE_PATHS = [
  '/login/',
  '/signup/',
  '/forgot-password/',
  '/reset-password/',
  '/onboarding/',
  '/auth/',
  '/evaluacion-nivel/',
  '/ruta-aprendizaje/',
  '/ruta-al-500/',
  '/fases/',
  '/clasificatoria/',
  '/logros/',
  '/perfil/',
  '/perfil/public/',
  '/configuracion/',
  '/tienda/',
  '/simulacro/',
  '/practica/',
  '/examen-completo/',
  '/api/',
  '/dev/',
];

const CRAWLER_RULES: MetadataRoute.Robots['rules'] = [
  {
    userAgent: '*',
    allow: '/',
    disallow: PRIVATE_PATHS,
  },
  {
    userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'anthropic-ai', 'Google-Extended', 'PerplexityBot'],
    allow: [
      '/',
      '/lectura/',
      '/consejos/',
      '/importancia/',
      '/informacion/',
      '/privacidad/',
      '/terminos/',
      '/llms.txt',
    ],
    disallow: PRIVATE_PATHS,
  },
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: CRAWLER_RULES,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
