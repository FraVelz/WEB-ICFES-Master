import { create } from 'zustand';

export interface UiSessionState {
  /** Synced from localStorage after client mount (see UiSessionHydrator). */
  hydrated: boolean;
  demoMode: boolean;
}

type HydratePayload = Pick<UiSessionState, 'demoMode'>;

interface UiSessionActions {
  hydrateUiSession: (payload: HydratePayload) => void;
  setDemoMode: (demoMode: boolean) => void;
}

function persistDemoMode(demoMode: boolean) {
  if (typeof window === 'undefined') return;
  if (demoMode) {
    localStorage.setItem('demoMode', 'true');
  } else {
    localStorage.removeItem('demoMode');
  }
}

/**
 * User authentication and profile from Supabase remain in features/auth/context/AuthContext.
 * Zustand holds UI session flags only (demo mode).
 */
export const useUiSessionStore = create<UiSessionState & UiSessionActions>((set) => ({
  hydrated: false,
  demoMode: false,

  hydrateUiSession: (payload) => set({ hydrated: true, ...payload }),

  setDemoMode: (demoMode) => {
    persistDemoMode(demoMode);
    set({ demoMode });
  },
}));
