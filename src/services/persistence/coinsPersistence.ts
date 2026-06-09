/**
 * Monedas virtuales — Supabase `user_gamification` o demo local.
 */
import { gamificationPersistence } from './gamificationPersistence';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { addDemoCoins, getDemoCoins, isDemoUserId, spendDemoCoins } from '@/services/demo/demoCoins';
import { isSupabaseConfigured } from './supabaseConfigured';

export const COINS_CHANGE_EVENT = 'icfes:coins-changed';

function emitCoinsChanged(balance: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COINS_CHANGE_EVENT, { detail: { balance } }));
  }
}

async function readGamificationBalance(userId: string): Promise<number> {
  const profile = await gamificationPersistence.getProfile(userId);
  return (profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0);
}

/** One-time migration from legacy `users.virtual_money` into gamification coins. */
async function migrateLegacyVirtualMoney(userId: string, currentBalance: number): Promise<number> {
  if (!isSupabaseConfigured() || currentBalance > 0) return currentBalance;

  try {
    const userProfile = await UserSupabaseService.getByUserId(userId);
    const legacyBalance = userProfile?.virtualMoney ?? 0;
    if (legacyBalance <= 0) return currentBalance;

    await UserSupabaseService.updateProfile(userId, { virtualMoney: 0 });
    await gamificationPersistence.addCoins(userId, legacyBalance, 'migration_legacy_balance');
    return legacyBalance;
  } catch {
    return currentBalance;
  }
}

export async function getCoinsBalance(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return getDemoCoins();
  }

  let balance = await readGamificationBalance(userId);
  balance = await migrateLegacyVirtualMoney(userId, balance);
  return balance;
}

export async function addCoinsBalance(userId: string, amount: number, reason = 'reward'): Promise<number> {
  if (isDemoUserId(userId)) {
    if (amount <= 0) return getDemoCoins();
    const balance = addDemoCoins(amount);
    emitCoinsChanged(balance);
    return balance;
  }

  if (amount <= 0) return getCoinsBalance(userId);
  await gamificationPersistence.addCoins(userId, amount, reason);
  const balance = await readGamificationBalance(userId);
  emitCoinsChanged(balance);
  return balance;
}

export async function spendCoinsBalance(userId: string, amount: number, item = 'purchase'): Promise<number> {
  if (isDemoUserId(userId)) {
    if (amount <= 0) return getDemoCoins();
    const balance = spendDemoCoins(amount);
    emitCoinsChanged(balance);
    return balance;
  }

  if (amount <= 0) return getCoinsBalance(userId);
  await gamificationPersistence.spendCoins(userId, amount, item);
  const balance = await readGamificationBalance(userId);
  emitCoinsChanged(balance);
  return balance;
}
