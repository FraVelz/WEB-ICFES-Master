import { Analytics } from '@vercel/analytics/react';

/** Web Analytics; active on Vercel preview/production, not in local dev. */
export function VercelMetrics() {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return <Analytics />;
}
