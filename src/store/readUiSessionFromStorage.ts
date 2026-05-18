import type { UiSessionState } from '@/store/slices/uiSessionSlice';
import type { UiPlan } from '@/store/types/uiPlan';

/** Lee flags de sesión UI desde localStorage (solo cliente). */
export function readUiSessionFromStorage(): Pick<
  UiSessionState,
  'demoMode' | 'selectedPlan' | 'fromPricingScrollPending'
> {
  if (typeof window === 'undefined') {
    return { demoMode: false, selectedPlan: null, fromPricingScrollPending: false };
  }

  const demoMode = localStorage.getItem('demoMode') === 'true';

  let selectedPlan: UiPlan | null = null;
  try {
    const raw = localStorage.getItem('selectedPlan');
    if (raw) selectedPlan = JSON.parse(raw) as UiPlan;
  } catch {
    selectedPlan = null;
  }

  const fromPricingScrollPending = !!localStorage.getItem('fromPricing');
  if (fromPricingScrollPending) {
    localStorage.removeItem('fromPricing');
  }

  return { demoMode, selectedPlan, fromPricingScrollPending };
}
