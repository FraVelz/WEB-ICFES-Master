import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
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
          '/practica/',
          '/examen-completo/',
          '/api/',
          '/dev/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
