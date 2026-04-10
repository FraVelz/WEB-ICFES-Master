import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UiPlan } from '@/store/types/uiPlan';

export interface UiSessionState {
  /** Synced from localStorage after client mount (see UiSessionHydrator). */
  hydrated: boolean;
  demoMode: boolean;
  /** Guest checkout resume / post-login payment (mirrors `selectedPlan` in localStorage). */
  selectedPlan: UiPlan | null;
  /** One-shot: scroll to pricing after returning from login (was `fromPricing` in localStorage). */
  fromPricingScrollPending: boolean;
}

const initialState: UiSessionState = {
  hydrated: false,
  demoMode: false,
  selectedPlan: null,
  fromPricingScrollPending: false,
};

export const uiSessionSlice = createSlice({
  name: 'uiSession',
  initialState,
  reducers: {
    hydrateUiSession(
      state,
      action: PayloadAction<{
        demoMode: boolean;
        selectedPlan: UiPlan | null;
        fromPricingScrollPending: boolean;
      }>
    ) {
      state.hydrated = true;
      state.demoMode = action.payload.demoMode;
      state.selectedPlan = action.payload.selectedPlan;
      state.fromPricingScrollPending = action.payload.fromPricingScrollPending;
    },
    setDemoMode(state, action: PayloadAction<boolean>) {
      state.demoMode = action.payload;
    },
    setSelectedPlan(state, action: PayloadAction<UiPlan | null>) {
      state.selectedPlan = action.payload;
    },
    consumeFromPricingScroll(state) {
      state.fromPricingScrollPending = false;
    },
  },
});

export const { hydrateUiSession, setDemoMode, setSelectedPlan, consumeFromPricingScroll } = uiSessionSlice.actions;
