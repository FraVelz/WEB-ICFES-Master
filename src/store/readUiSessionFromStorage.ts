import type { UiSessionState } from '@/store/uiSessionStore';

const LEGACY_PLAN_KEYS = ['selectedPlan', 'fromPricing', 'icfes_user_plan'] as const;

/** Lee flags de sesión UI desde localStorage (solo cliente). */
export function readUiSessionFromStorage(): Pick<UiSessionState, 'demoMode'> {
  if (typeof window === 'undefined') {
    return { demoMode: false };
  }

  for (const key of LEGACY_PLAN_KEYS) {
    localStorage.removeItem(key);
  }

  const demoMode = localStorage.getItem('demoMode') === 'true';

  return { demoMode };
}
