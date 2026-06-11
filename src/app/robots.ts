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
          '/fases/',
          '/clasificatoria/',
          '/logros/',
          '/perfil/',
          '/configuracion/',
          '/tienda/',
          '/practica/',
          '/examen-completo/',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
