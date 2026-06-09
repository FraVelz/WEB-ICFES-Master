import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';
import { resolveLevelAssessmentRedirect } from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';

/** Activa modo demo y persiste en localStorage antes de navegar (evita perder el flag al recargar). */
export function enterDemoMode() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', 'true');
    ensureDemoCoinsMinimum();
  }
  useUiSessionStore.getState().setDemoMode(true);
}

/** Activa demo y lleva a la evaluación inicial solo si aún no se completó. */
export function enterDemoModeWithAssessment() {
  enterDemoMode();
  if (typeof window === 'undefined') return;

  void resolveLevelAssessmentRedirect({ demoMode: true }, null).then((redirect) => {
    if (redirect) {
      window.location.href = redirect;
      return;
    }
    window.location.href = buildLevelAssessmentUrl('demo');
  });
}

/**
 * Sale del demo e ir al inicio sin tocar el store antes de navegar
 * (evita un frame donde ProtectedPage muestra el contenido bloqueado).
 */
export function exitDemoModeToHome() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('demoMode');
  window.location.replace('/');
}
