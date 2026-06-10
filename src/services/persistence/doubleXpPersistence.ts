/**
 * Potenciador Doble XP — expira en `user_gamification.double_xp_expires_at` (demo: localStorage).
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { DOUBLE_XP_DURATION_MS } from '@/features/store/constants/doubleXp';

export const DOUBLE_XP_CHANGE_EVENT = 'icfes:double-xp-changed';

const DEMO_DOUBLE_XP_KEY = 'icfes_demo_double_xp_expires_at';

function emitDoubleXpChanged(expiresAt: string | null): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(DOUBLE_XP_CHANGE_EVENT, { detail: { expiresAt } }));
}

function readDemoExpiresAt(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(DEMO_DOUBLE_XP_KEY);
  if (!raw) return null;
  const expiresAt = new Date(raw);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    localStorage.removeItem(DEMO_DOUBLE_XP_KEY);
    return null;
  }
  return raw;
}

function writeDemoExpiresAt(expiresAt: string | null): string | null {
  if (typeof window !== 'undefined') {
    if (expiresAt) {
      localStorage.setItem(DEMO_DOUBLE_XP_KEY, expiresAt);
    } else {
      localStorage.removeItem(DEMO_DOUBLE_XP_KEY);
    }
  }
  emitDoubleXpChanged(expiresAt);
  return expiresAt;
}

function computeNextExpiry(currentExpiresAt: string | null): string {
  const now = Date.now();
  const current = currentExpiresAt ? new Date(currentExpiresAt).getTime() : 0;
  const base = Math.max(now, current);
  return new Date(base + DOUBLE_XP_DURATION_MS).toISOString();
}

export async function getDoubleXpExpiresAt(userId: string): Promise<string | null> {
  if (isDemoUserId(userId)) {
    return readDemoExpiresAt();
  }

  const profile = await GamificationSupabaseService.getOrCreate(userId);
  const expiresAt = profile.doubleXpExpiresAt;
  if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
    return null;
  }
  return expiresAt;
}

export async function activateDoubleXp(userId: string): Promise<string> {
  const nextExpiresAt = isDemoUserId(userId)
    ? computeNextExpiry(readDemoExpiresAt())
    : await GamificationSupabaseService.activateDoubleXp(userId);

  if (isDemoUserId(userId)) {
    writeDemoExpiresAt(nextExpiresAt);
    return nextExpiresAt;
  }

  emitDoubleXpChanged(nextExpiresAt);
  return nextExpiresAt;
}
