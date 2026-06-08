import { create } from 'zustand';

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

type HydratePayload = Pick<UiSessionState, 'demoMode' | 'selectedPlan' | 'fromPricingScrollPending'>;

interface UiSessionActions {
  hydrateUiSession: (payload: HydratePayload) => void;
  setDemoMode: (demoMode: boolean) => void;
  setSelectedPlan: (plan: UiPlan | null) => void;
  consumeFromPricingScroll: () => void;
}

function persistDemoMode(demoMode: boolean) {
  if (typeof window === 'undefined') return;
  if (demoMode) {
    localStorage.setItem('demoMode', 'true');
  } else {
    localStorage.removeItem('demoMode');
  }
}

function persistSelectedPlan(plan: UiPlan | null) {
  if (typeof window === 'undefined') return;
  if (plan) {
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
  } else {
    localStorage.removeItem('selectedPlan');
  }
}

/**
 * User authentication and profile from Supabase (or mock) remain in features/auth/context/AuthContext.
 *
 * Zustand holds UI session flags only: demo mode, pricing checkout resume, and related UI state.
 * Server-backed data and Supabase subscriptions stay outside this store.
 */
export const useUiSessionStore = create<UiSessionState & UiSessionActions>((set) => ({
  hydrated: false,
  demoMode: false,
  selectedPlan: null,
  fromPricingScrollPending: false,

  hydrateUiSession: (payload) => set({ hydrated: true, ...payload }),

  setDemoMode: (demoMode) => {
    persistDemoMode(demoMode);
    set({ demoMode });
  },

  setSelectedPlan: (selectedPlan) => {
    persistSelectedPlan(selectedPlan);
    set({ selectedPlan });
  },

  consumeFromPricingScroll: () => set({ fromPricingScrollPending: false }),
}));
