export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return;

  const { isKvConfigured } = await import('@/utils/kvRest');
  if (isKvConfigured()) return;

  console.warn(
    '[icfes] KV_REST_API_URL / KV_REST_API_TOKEN not configured. ' +
      'Rate limits and chat daily quota are per serverless instance. ' +
      'See docs/es/setup/configuration.md'
  );
}
