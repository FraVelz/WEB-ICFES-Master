import type { Metadata } from 'next';

/** Matches `src/app/opengraph-image.png` + `opengraph-image.alt.txt`. */
const OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'ICFES Master — Domina el ICFES desde Cero. Mascota Zeus con birrete y libro.',
} as const;

export const ogImageOpenGraph = { images: [OG_IMAGE] } satisfies Metadata['openGraph'];

export const ogImageTwitter = {
  card: 'summary_large_image' as const,
  images: [OG_IMAGE.url],
} satisfies Metadata['twitter'];

/** Last content refresh for structured data (ISO date). */
export const CONTENT_LAST_UPDATED = '2026-06-12';
