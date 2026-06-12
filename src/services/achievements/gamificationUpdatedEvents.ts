import { STREAK_UPDATED_EVENT } from '@/services/streak';

export type GamificationUpdatedDetail = {
  progressChanged: boolean;
  hadNewUnlocks: boolean;
};

/** Notifica a la UI solo cuando el sync de logros cambió datos visibles. */
export function notifyGamificationUpdatedIfNeeded(detail: GamificationUpdatedDetail): void {
  if (typeof window === 'undefined') return;
  if (!detail.progressChanged && !detail.hadNewUnlocks) return;
  window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT, { detail }));
}
