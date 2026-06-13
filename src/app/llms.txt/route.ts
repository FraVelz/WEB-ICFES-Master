import { PUBLIC_CONTENT_PAGES } from '@/config/publicContentPages';
import { getSiteUrl } from '@/config/site';

export function GET() {
  const siteUrl = getSiteUrl();

  const body = [
    '# ICFES Master',
    '',
    '> Plataforma gratuita de preparación para el examen ICFES (Saber 11°) en Colombia.',
    '',
    '## Sitio principal',
    `- ${siteUrl}/`,
    '',
    '## Recursos públicos',
    ...PUBLIC_CONTENT_PAGES.map((page) => `- ${page.label}: ${siteUrl}${page.href} — ${page.description}`),
    '',
    '## Funcionalidades con cuenta (registro gratuito)',
    '- Simulacros y examen completo por áreas del ICFES',
    '- Práctica con retroalimentación y gamificación (XP, monedas, logros)',
    '- Ruta de aprendizaje guiada y evaluación de nivel inicial',
    '',
    '## Contacto',
    '- fravelz@proton.me',
    '',
    '## Idioma',
    '- es-CO (español colombiano)',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
