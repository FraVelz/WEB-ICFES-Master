import { describe, expect, it, vi, beforeEach } from 'vitest';

import { enterDemoMode, enterDemoModeWithAssessment, exitDemoModeToHome } from '@/store/demoMode';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { DEMO_COINS_MIN } from '@/services/demo/demoCoins';

describe('demoMode', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    useUiSessionStore.setState({
      hydrated: false,
      demoMode: false,
      sidebarExpanded: false,
    });
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

  it('persiste demoMode y actualiza el store', () => {
    enterDemoMode();
    expect(storage.get('demoMode')).toBe('true');
    expect(storage.get('icfes_demo_coins')).toBe(String(DEMO_COINS_MIN));
    expect(useUiSessionStore.getState().demoMode).toBe(true);
  });

  it('sale del demo y redirige al home', () => {
    storage.set('demoMode', 'true');
    const replace = vi.fn();
    vi.stubGlobal('location', { replace });

    exitDemoModeToHome();

    expect(storage.has('demoMode')).toBe(false);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('enterDemoModeWithAssessment salta la evaluación si demo ya la completó', async () => {
    storage.set('icfes_level_assessment_done_demo', 'true');
    storage.set('icfes_skill_level_demo', 'basics');

    const hrefSetter = vi.fn();
    let hrefValue = '';
    vi.stubGlobal('location', {
      get href() {
        return hrefValue;
      },
      set href(value: string) {
        hrefValue = value;
        hrefSetter(value);
      },
    });

    enterDemoModeWithAssessment();
    await vi.waitFor(() => expect(hrefSetter).toHaveBeenCalled());

    expect(hrefSetter).toHaveBeenCalledWith('/ruta-aprendizaje?area=lectura-critica&etapa=facil');
  });
});
