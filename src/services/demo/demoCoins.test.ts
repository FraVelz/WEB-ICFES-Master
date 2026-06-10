import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEMO_COINS_MIN, addDemoCoins, ensureDemoCoinsMinimum, getDemoCoins, spendDemoCoins } from './demoCoins';

describe('demoCoins', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => storage.clear(),
    });
  });

  it('inicializa con el mínimo de monedas', () => {
    expect(ensureDemoCoinsMinimum()).toBe(DEMO_COINS_MIN);
    expect(getDemoCoins()).toBe(DEMO_COINS_MIN);
  });

  it('no baja el saldo por debajo del mínimo al reasegurar', () => {
    addDemoCoins(500);
    expect(getDemoCoins()).toBe(DEMO_COINS_MIN + 500);
    expect(ensureDemoCoinsMinimum()).toBe(DEMO_COINS_MIN + 500);
  });

  it('gasta monedas del demo', () => {
    ensureDemoCoinsMinimum();
    expect(spendDemoCoins(30)).toBe(DEMO_COINS_MIN - 30);
  });

  it('sube al mínimo si el saldo guardado es menor', () => {
    localStorage.setItem('icfes_demo_coins', '50');
    expect(ensureDemoCoinsMinimum()).toBe(DEMO_COINS_MIN);
  });
});
