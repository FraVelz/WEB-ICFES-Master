import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { setDemoMode, setSelectedPlan, type UiSessionState } from '@/store/slices/uiSessionSlice';

/**
 * Keeps `demoMode` and `selectedPlan` aligned with legacy localStorage keys
 * used across the app and for guest → login → resume checkout.
 */
export const uiSessionSyncMiddleware = createListenerMiddleware();

const persistMatcher = isAnyOf(setDemoMode, setSelectedPlan);

uiSessionSyncMiddleware.startListening({
  matcher: persistMatcher,
  effect: (_action, listenerApi) => {
    const ui = (listenerApi.getState() as { uiSession: UiSessionState }).uiSession;
    if (!ui) return;

    if (ui.demoMode) {
      localStorage.setItem('demoMode', 'true');
    } else {
      localStorage.removeItem('demoMode');
    }

    if (ui.selectedPlan) {
      localStorage.setItem('selectedPlan', JSON.stringify(ui.selectedPlan));
    } else {
      localStorage.removeItem('selectedPlan');
    }
  },
});
