const DEFAULT_SITE_URL = 'https://icfesmaster.com';

/** Public origin for metadata, sitemap and Open Graph. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      /* fall through */
    }
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }

  return DEFAULT_SITE_URL;
}
