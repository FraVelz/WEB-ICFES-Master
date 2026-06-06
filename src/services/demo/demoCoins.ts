export const DEMO_USER_ID = 'demo';
export const DEMO_COINS_MIN = 2000;

const DEMO_COINS_KEY = 'icfes_demo_coins';

export function isDemoUserId(userId: string): boolean {
  return userId === DEMO_USER_ID;
}

export function resolveCoinsUserId(authUserId?: string | null, demoMode?: boolean): string | null {
  if (authUserId && authUserId !== DEMO_USER_ID) return authUserId;
  if (demoMode) return DEMO_USER_ID;
  return null;
}

function readStoredDemoCoins(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(DEMO_COINS_KEY);
  if (raw == null) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ensureDemoCoinsMinimum(min = DEMO_COINS_MIN): number {
  if (typeof window === 'undefined') return min;
  const stored = readStoredDemoCoins();
  const next = Math.max(stored ?? 0, min);
  localStorage.setItem(DEMO_COINS_KEY, String(next));
  return next;
}

export function getDemoCoins(): number {
  const stored = readStoredDemoCoins();
  if (stored == null) return ensureDemoCoinsMinimum();
  return stored;
}

export function setDemoCoins(amount: number): number {
  if (typeof window === 'undefined') return Math.max(0, amount);
  const next = Math.max(0, amount);
  localStorage.setItem(DEMO_COINS_KEY, String(next));
  return next;
}

export function addDemoCoins(amount: number): number {
  if (amount <= 0) return getDemoCoins();
  return setDemoCoins(getDemoCoins() + amount);
}

export function spendDemoCoins(amount: number): number {
  if (amount <= 0) return getDemoCoins();
  const current = getDemoCoins();
  if (amount > current) {
    throw new Error('Monedas insuficientes');
  }
  return setDemoCoins(current - amount);
}
