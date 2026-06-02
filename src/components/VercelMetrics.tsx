import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

/** Web Analytics + Speed Insights; active on Vercel preview/production, not in local dev. */
export function VercelMetrics() {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
