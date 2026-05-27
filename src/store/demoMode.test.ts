import { describe, expect, it, vi, beforeEach } from 'vitest';

import { enterDemoMode, exitDemoModeToHome } from '@/store/demoMode';

describe('demoMode', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.restoreAllMocks();
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

  it('persiste demoMode y despacha setDemoMode', () => {
    const dispatch = vi.fn();
    enterDemoMode(dispatch);
    expect(storage.get('demoMode')).toBe('true');
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('setDemoMode') }));
  });

  it('sale del demo y redirige al home', () => {
    storage.set('demoMode', 'true');
    const replace = vi.fn();
    vi.stubGlobal('location', { replace });

    exitDemoModeToHome();

    expect(storage.has('demoMode')).toBe(false);
    expect(replace).toHaveBeenCalledWith('/');
  });
});
