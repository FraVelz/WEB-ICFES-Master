import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';
import { resolvePostAuthEntryPath } from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';

function syncDemoSessionCookie(method: 'POST' | 'DELETE') {
  if (typeof window === 'undefined') return;
  const url = `${window.location.origin}/api/demo/session/`;
  void fetch(url, { method }).catch(() => {});
}

/** Activa modo demo y persiste en localStorage antes de navegar (evita perder el flag al recargar). */
export function enterDemoMode() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', 'true');
    ensureDemoCoinsMinimum();
    syncDemoSessionCookie('POST');
  }
  useUiSessionStore.getState().setDemoMode(true);
}

/** Activa demo y lleva a la evaluación inicial solo si aún no se completó. */
export function enterDemoModeWithAssessment(navigate?: (path: string) => void) {
  enterDemoMode();
  if (typeof window === 'undefined') return;

  void resolvePostAuthEntryPath({ demoMode: true }, null).then((path) => {
    if (navigate) {
      navigate(path);
      return;
    }
    window.location.href = path;
  });
}

/**
 * Sale del demo e ir al inicio sin tocar el store antes de navegar
 * (evita un frame donde ProtectedPage muestra el contenido bloqueado).
 */
export function exitDemoModeToHome() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('demoMode');
  syncDemoSessionCookie('DELETE');
  window.location.replace('/');
}
