/**
 * Product feature flags (env).
 * Defaults are safe/off: billing stays off for 2026; OpenAI requires an explicit flag and API key.
 */

function isTruthyEnv(...names: string[]): boolean {
  for (const name of names) {
    const raw = process.env[name]?.trim().toLowerCase();
    if (raw === 'true' || raw === '1' || raw === 'yes') return true;
  }
  return false;
}

/**
 * Subscription / paid-plan product (Free/Pro/Premium).
 * Default: off. Unset or any non-truthy value keeps billing UI and CTAs hidden.
 */
export function isBillingEnabled(): boolean {
  return isTruthyEnv('NEXT_PUBLIC_BILLING_ENABLED', 'BILLING_ENABLED');
}

/**
 * OpenAI chat assistant.
 * On when OPENAI_ENABLED (or NEXT_PUBLIC_OPENAI_ENABLED) is truthy **and** OPENAI_API_KEY is set.
 * Default: off if the flag is unset/false or the key is missing.
 */
export function isOpenAIEnabled(): boolean {
  const flagOn = isTruthyEnv('NEXT_PUBLIC_OPENAI_ENABLED', 'OPENAI_ENABLED');
  if (!flagOn) return false;
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/**
 * Client-visible OpenAI gate (inlined at build time via NEXT_PUBLIC_*).
 * Does not read the secret key; pair with server `isOpenAIEnabled()` on API routes.
 */
export function isOpenAIEnabledClient(): boolean {
  return isTruthyEnv('NEXT_PUBLIC_OPENAI_ENABLED');
}
