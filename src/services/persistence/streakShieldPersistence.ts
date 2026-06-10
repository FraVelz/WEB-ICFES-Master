/**
 * Protectores de racha — `user_gamification.streak_shield_count` (demo: localStorage).
 */
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { MAX_STREAK_SHIELDS } from '@/features/store/constants/streakShield';

export const STREAK_SHIELD_CHANGE_EVENT = 'icfes:streak-shield-changed';

const DEMO_STREAK_SHIELD_KEY = 'icfes_demo_streak_shield_count';

function emitStreakShieldChanged(count: number): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(STREAK_SHIELD_CHANGE_EVENT, { detail: { count } }));
}

function readDemoShieldCount(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(DEMO_STREAK_SHIELD_KEY);
  const parsed = raw != null ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? Math.min(MAX_STREAK_SHIELDS, Math.max(0, parsed)) : 0;
}

function writeDemoShieldCount(count: number): number {
  const normalized = Math.min(MAX_STREAK_SHIELDS, Math.max(0, count));
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_STREAK_SHIELD_KEY, String(normalized));
  }
  emitStreakShieldChanged(normalized);
  return normalized;
}

export async function getStreakShieldCount(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return readDemoShieldCount();
  }
  const profile = await GamificationSupabaseService.getOrCreate(userId);
  return Math.min(MAX_STREAK_SHIELDS, Math.max(0, profile.streakShieldCount ?? 0));
}

export async function addStreakShield(userId: string): Promise<number> {
  const current = await getStreakShieldCount(userId);
  if (current >= MAX_STREAK_SHIELDS) {
    throw new Error(`Solo puedes tener hasta ${MAX_STREAK_SHIELDS} protectores de racha`);
  }

  if (isDemoUserId(userId)) {
    return writeDemoShieldCount(current + 1);
  }

  const next = await GamificationSupabaseService.setStreakShieldCount(userId, current + 1);
  emitStreakShieldChanged(next);
  return next;
}

export async function consumeStreakShield(userId: string): Promise<number> {
  return consumeStreakShields(userId, 1);
}

export async function consumeStreakShields(userId: string, count: number): Promise<number> {
  if (count <= 0) return getStreakShieldCount(userId);

  const current = await getStreakShieldCount(userId);
  if (current <= 0) return 0;

  const next = Math.max(0, current - count);

  if (isDemoUserId(userId)) {
    return writeDemoShieldCount(next);
  }

  const saved = await GamificationSupabaseService.setStreakShieldCount(userId, next);
  emitStreakShieldChanged(saved);
  return saved;
}
