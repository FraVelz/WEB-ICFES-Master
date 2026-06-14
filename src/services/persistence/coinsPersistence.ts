/**
 * Monedas virtuales — Supabase `user_gamification` o demo local.
 */
import { gamificationPersistence } from './gamificationPersistence';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { addDemoCoins, getDemoCoins, isDemoUserId, spendDemoCoins } from '@/services/demo/demoCoins';

export const COINS_CHANGE_EVENT = 'icfes:coins-changed';

function emitCoinsChanged(balance: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COINS_CHANGE_EVENT, { detail: { balance } }));
  }
}

async function readGamificationBalance(userId: string): Promise<number> {
  const profile = await GamificationSupabaseService.getEconomyByUserId(userId);
  return (profile?.totalCoins ?? 0) - (profile?.spentCoins ?? 0);
}

export async function getCoinsBalance(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return getDemoCoins();
  }

  return readGamificationBalance(userId);
}

export async function addCoinsBalance(userId: string, amount: number, reason = 'reward'): Promise<number> {
  if (isDemoUserId(userId)) {
    if (amount <= 0) return getDemoCoins();
    const balance = addDemoCoins(amount);
    emitCoinsChanged(balance);
    return balance;
  }

  if (amount <= 0) return getCoinsBalance(userId);

  throw new Error('Las monedas solo se otorgan desde acciones verificadas en el servidor');
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
