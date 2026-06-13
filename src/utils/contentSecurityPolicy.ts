const isProd = process.env.NODE_ENV === 'production';

const VERCEL_ANALYTICS_SCRIPT = 'https://va.vercel-scripts.com';

function buildCspDirectives(nonce: string, frameAncestors: "'none'" | "'self'"): string {
  const scriptSrc = isProd
    ? `script-src 'self' 'nonce-${nonce}' ${VERCEL_ANALYTICS_SCRIPT}`
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://vitals.vercel-insights.com",
    `frame-ancestors ${frameAncestors}`,
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export function buildContentSecurityPolicy(nonce: string): string {
  return buildCspDirectives(nonce, "'none'");
}

export function buildEmbeddableContentSecurityPolicy(nonce: string): string {
  return buildCspDirectives(nonce, "'self'");
}

function applyCommonSecurityHeaders(response: Response): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (isProd) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
}

export function applySecurityHeaders(response: Response, nonce: string): void {
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));
  response.headers.set('X-Frame-Options', 'DENY');
  applyCommonSecurityHeaders(response);
}

/** PDFs servidos por la API deben poder mostrarse en iframes del mismo origen. */
export function applyEmbeddableSecurityHeaders(response: Response, nonce: string): void {
  response.headers.set('Content-Security-Policy', buildEmbeddableContentSecurityPolicy(nonce));
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  applyCommonSecurityHeaders(response);
}

export function isEmbeddableAssetPath(pathname: string): boolean {
  return pathname.startsWith('/api/r2/infographic/');
}
