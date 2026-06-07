/**
 * Monedas virtuales — única fuente de verdad.
 * Supabase: user_gamification (total_coins - spent_coins).
 * localStorage: icfes_user_profile.virtualMoney vía gamificationPersistence.
 */
import { gamificationPersistence } from './gamificationPersistence';
import { isSupabaseMode } from './apiMode';
import { getVirtualMoney, updateUserProfile } from '@/storage/userProfile';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { addDemoCoins, getDemoCoins, isDemoUserId, spendDemoCoins } from '@/services/demo/demoCoins';

export const COINS_CHANGE_EVENT = 'icfes:coins-changed';

function emitCoinsChanged(balance: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COINS_CHANGE_EVENT, { detail: { balance } }));
  }
}

async function readGamificationBalance(userId: string): Promise<number> {
  const profile = await gamificationPersistence.getProfile(userId);
  if (isSupabaseMode()) {
    return (profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0);
  }
  return getVirtualMoney();
}

async function migrateLegacyBalance(userId: string, currentBalance: number): Promise<number> {
  if (!isSupabaseMode() || currentBalance > 0) return currentBalance;

  const localBalance = getVirtualMoney();
  let legacyBalance = localBalance;

  try {
    const userProfile = await UserSupabaseService.getByUserId(userId);
    legacyBalance = Math.max(localBalance, userProfile?.virtualMoney ?? 0);
    if (userProfile && (userProfile.virtualMoney ?? 0) > 0) {
      await UserSupabaseService.updateProfile(userId, { virtualMoney: 0 });
    }
  } catch {
    // Sin Supabase configurado o usuario inexistente — solo migrar localStorage
  }

  if (legacyBalance <= 0) return currentBalance;

  await gamificationPersistence.addCoins(userId, legacyBalance, 'migration_legacy_balance');
  updateUserProfile({ virtualMoney: 0 });
  return legacyBalance;
}

export async function getCoinsBalance(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return getDemoCoins();
  }

  let balance = await readGamificationBalance(userId);
  balance = await migrateLegacyBalance(userId, balance);
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
