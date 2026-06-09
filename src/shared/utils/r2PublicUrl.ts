const DEFAULT_PDF_PREFIX = 'acerca-de-icfes-11-pdfs';

/** URL pública de un objeto en Cloudflare R2 (bucket con acceso público o dominio custom). */
export function getR2PublicAssetUrl(filename: string): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/$/, '');
  if (!base) return null;

  const prefix = (process.env.NEXT_PUBLIC_R2_PDF_PREFIX?.trim() || DEFAULT_PDF_PREFIX).replace(
    /^\/+|\/+$/g,
    '',
  );

  const encoded = filename
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${base}/${prefix}/${encoded}`;
}

export function isR2PublicUrlConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim());
}
